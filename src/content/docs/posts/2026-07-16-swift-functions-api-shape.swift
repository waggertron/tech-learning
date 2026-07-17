typealias Note = (title: String, tags: [String], rating: Int)
typealias RankedNote = (title: String, score: Int)

func ranksBefore(_ left: RankedNote, _ right: RankedNote) -> Bool {
    if left.score != right.score {
        return left.score > right.score
    }

    return left.title < right.title
}

func rank(
    notes: [Note],
    matching query: String,
    limit: Int = 3
) -> [String] {
    guard limit > 0 else { return [] }

    let normalizedQuery = query.lowercased()
    guard !normalizedQuery.isEmpty else { return [] }

    var candidates: [RankedNote] = []

    for note in notes {
        var matches = false
        var score = note.rating

        if note.title.lowercased().contains(normalizedQuery) {
            matches = true
            score += 5
        }

        for tag in note.tags where tag.lowercased() == normalizedQuery {
            matches = true
            score += 10
            break
        }

        if matches {
            candidates.append((title: note.title, score: score))
        }
    }

    let ordered = candidates.sorted(by: ranksBefore)
    var titles: [String] = []

    for candidate in ordered.prefix(limit) {
        titles.append(candidate.title)
    }

    return titles
}

let notes: [Note] = [
    ("Fog over the north ridge", ["weather", "ridge"], 5),
    ("Lake trail reopened", ["trail", "access"], 4),
    ("Parking lot full", ["access"], 2),
    ("Alpine flowers", ["ridge", "flowers"], 5),
]

let results = rank(notes: notes, matching: "ridge", limit: 2)
precondition(results == ["Fog over the north ridge", "Alpine flowers"])

var position = 1
for title in results {
    print("\(position). \(title)")
    position += 1
}
