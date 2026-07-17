struct FieldNote: Equatable {
    let id: Int
    let title: String
}

struct Page<Element> {
    let items: [Element]
    let nextCursor: Int?

    func map<Transformed>(
        _ transform: (Element) -> Transformed
    ) -> Page<Transformed> {
        Page<Transformed>(
            items: items.map(transform),
            nextCursor: nextCursor
        )
    }
}

func page<Element>(
    _ elements: [Element],
    after cursor: Int?,
    size: Int
) -> Page<Element> {
    let start = min(cursor ?? 0, elements.count)
    let end = min(start + max(0, size), elements.count)
    let items = Array(elements[start..<end])
    let nextCursor = end < elements.count ? end : nil
    return Page(items: items, nextCursor: nextCursor)
}

protocol NoteSource<Note> {
    associatedtype Note
    func fetch() -> [Note]
}

struct MemorySource<Note>: NoteSource {
    let notes: [Note]

    func fetch() -> [Note] {
        notes
    }
}

struct PrefixSource<Base: NoteSource>: NoteSource
where Base.Note == FieldNote {
    let base: Base
    let prefix: String

    func fetch() -> [FieldNote] {
        base.fetch().filter { $0.title.hasPrefix(prefix) }
    }
}

func count<Source: NoteSource>(
    in source: Source
) -> Int where Source.Note == FieldNote {
    source.fetch().count
}

func makePreviewSource() -> some NoteSource<FieldNote> {
    MemorySource(notes: [
        FieldNote(id: 1, title: "Fog"),
        FieldNote(id: 2, title: "Forest"),
        FieldNote(id: 3, title: "Rain")
    ])
}

let notes = makePreviewSource().fetch()
let firstPage = page(notes, after: nil, size: 2)
let titlePage = firstPage.map(\.title)
let filtered = PrefixSource(base: makePreviewSource(), prefix: "Fo")
let runtimeSource: any NoteSource<FieldNote> = filtered
let runtimeNotes = runtimeSource.fetch()

precondition(firstPage.items.map(\.title) == ["Fog", "Forest"])
precondition(firstPage.nextCursor == 2)
precondition(titlePage.items == ["Fog", "Forest"])
precondition(titlePage.nextCursor == 2)
precondition(count(in: filtered) == 2)
precondition(runtimeNotes.map(\.title) == ["Fog", "Forest"])

print("Page: \(titlePage.items.joined(separator: ", "))")
print("Next cursor: \(firstPage.nextCursor ?? -1)")
print("Generic count: \(count(in: filtered))")
print("Existential titles: \(runtimeNotes.map(\.title).joined(separator: ", "))")
print("Opaque source count: \(notes.count)")
