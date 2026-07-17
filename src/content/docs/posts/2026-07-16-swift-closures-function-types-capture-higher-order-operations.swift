struct Note {
    let title: String
    let rating: Int
    let tags: [String]
}

let notes = [
    Note(title: "Fog", rating: 5, tags: ["swift", "weather"]),
    Note(title: "Tide", rating: 3, tags: ["coast"]),
    Note(title: "Draft", rating: 1, tags: []),
    Note(title: "Ridge", rating: 4, tags: ["swift", "hike"])
]

func ranksBefore(_ left: Note, _ right: Note) -> Bool {
    if left.rating == right.rating {
        return left.title < right.title
    }

    return left.rating > right.rating
}

var minimumRating = 3

let readsCurrentMinimum: (Note) -> Bool = { note in
    note.rating >= minimumRating
}

let capturedMinimum: (Note) -> Bool = { [minimumRating] note in
    note.rating >= minimumRating
}

minimumRating = 5

func rankedTitles(
    in notes: [Note],
    matching predicate: (Note) -> Bool
) -> [String] {
    notes
        .filter(predicate)
        .sorted(by: ranksBefore)
        .map(\.title)
}

func makeTagMatcher(_ tag: String) -> (Note) -> Bool {
    { note in
        note.tags.contains(tag)
    }
}

let snapshotTitles = rankedTitles(in: notes, matching: capturedMinimum)
let liveTitles = rankedTitles(in: notes, matching: readsCurrentMinimum)
let snapshotTotal = notes
    .filter(capturedMinimum)
    .map(\.rating)
    .reduce(0, +)
let swiftTitles = rankedTitles(in: notes, matching: makeTagMatcher("swift"))

precondition(snapshotTitles == ["Fog", "Ridge", "Tide"])
precondition(liveTitles == ["Fog"])
precondition(snapshotTotal == 12)
precondition(swiftTitles == ["Fog", "Ridge"])

print("Snapshot >= 3: \(snapshotTitles.joined(separator: ", "))")
print("Live >= 5: \(liveTitles.joined(separator: ", "))")
print("Total snapshot rating: \(snapshotTotal)")
print("Swift tagged: \(swiftTitles.joined(separator: ", "))")
