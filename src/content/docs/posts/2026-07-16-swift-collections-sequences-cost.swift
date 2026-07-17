typealias Note = (title: String, tags: [String], rating: Int)

let notes: [Note] = [
    ("Parking lot full", ["access"], 2),
    ("Fog over the north ridge", ["weather", "ridge"], 5),
    ("Lake trail reopened", ["trail", "access"], 4),
    ("Alpine flowers", ["ridge", "flowers"], 5),
]

var tagIndex: [String: [String]] = [:]

for note in notes {
    for tag in note.tags {
        tagIndex[tag, default: []].append(note.title)
    }
}

for tag in tagIndex.keys.sorted() {
    let titles = tagIndex[tag, default: []].joined(separator: ", ")
    print("\(tag): \(titles)")
}

var eagerChecks = 0
let eagerMatches = notes.filter { note in
    eagerChecks += 1
    return note.rating >= 4
}
let eagerFirst = eagerMatches.first?.title

var lazyChecks = 0
let lazyFirst = notes.lazy.filter { note in
    lazyChecks += 1
    return note.rating >= 4
}.first?.title

precondition(eagerFirst == lazyFirst)
precondition(eagerChecks == 4)
precondition(lazyChecks == 2)

print("Eager checks: \(eagerChecks)")
print("Lazy checks: \(lazyChecks)")
print("First selected: \(lazyFirst ?? "None")")
