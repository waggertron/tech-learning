class EditingSession {
    let noteID: Int
    var draftTitle: String

    init(noteID: Int, draftTitle: String) {
        self.noteID = noteID
        self.draftTitle = draftTitle
    }

    func rename(to newTitle: String) {
        draftTitle = newTitle
    }

    func status() -> String {
        "Editing note \(noteID)"
    }
}

final class SharedEditingSession: EditingSession {
    let collaborator: String

    init(noteID: Int, draftTitle: String, collaborator: String) {
        self.collaborator = collaborator
        super.init(noteID: noteID, draftTitle: draftTitle)
    }

    override func status() -> String {
        "Shared with \(collaborator)"
    }
}

let first: EditingSession = SharedEditingSession(
    noteID: 1,
    draftTitle: "Fog",
    collaborator: "Mira"
)
let alias = first
let independent = EditingSession(noteID: 1, draftTitle: "Fog")

alias.rename(to: "North ridge fog")

precondition(first === alias)
precondition(first !== independent)
precondition(first.draftTitle == "North ridge fog")
precondition(first is SharedEditingSession)

print("Same instance: \(first === alias)")
print("Independent instance: \(first !== independent)")
print("Title through first: \(first.draftTitle)")

if let shared = first as? SharedEditingSession {
    print("Dynamic type: \(shared.status())")
}
