struct FieldNote: Equatable {
    let id: Int
    var title: String
    var tags: [String]
    var isFavorite: Bool

    func renamed(to newTitle: String) -> FieldNote {
        var copy = self
        copy.title = newTitle
        return copy
    }

    mutating func toggleFavorite() {
        isFavorite.toggle()
    }
}

let original = FieldNote(
    id: 1,
    title: "Fog over the north ridge",
    tags: ["weather", "ridge"],
    isFavorite: false
)

var edited = original
edited.title = "Fog lifting over the north ridge"
edited.tags.append("morning")
edited.toggleFavorite()

let renamed = original.renamed(to: "North ridge fog")

precondition(original.title == "Fog over the north ridge")
precondition(original.tags == ["weather", "ridge"])
precondition(original.isFavorite == false)
precondition(edited.isFavorite == true)
precondition(renamed.title == "North ridge fog")

print("Original: \(original.title) | \(original.tags.joined(separator: ", ")) | favorite \(original.isFavorite)")
print("Edited: \(edited.title) | \(edited.tags.joined(separator: ", ")) | favorite \(edited.isFavorite)")
print("Renamed copy: \(renamed.title)")
