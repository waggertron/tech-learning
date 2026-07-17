let notes = [
    (title: "Fog over the north ridge", rating: 5, isFavorite: true),
    (title: "Lake trail reopened", rating: 4, isFavorite: false),
    (title: "Parking lot full", rating: 2, isFavorite: false),
    (title: "Alpine flowers", rating: 5, isFavorite: false),
]

var selectedCount = 0

for note in notes where (4...5).contains(note.rating) {
    let label: String

    switch (note.rating, note.isFavorite) {
    case (5, true):
        label = "Featured"
    case (4...5, _):
        label = "Recommended"
    default:
        label = "Review"
    }

    selectedCount += 1
    print("\(label): \(note.title)")
}

precondition(selectedCount == 3)
