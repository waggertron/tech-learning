final class EditorSession {
    let title: String
    var onSave: (() -> Void)?
    private(set) var savedCount = 0

    init(title: String) {
        self.title = title
    }

    func recordSave() {
        savedCount += 1
    }
}

func makeLeakingEditor() -> EditorSession {
    let editor = EditorSession(title: "Tide Pools")
    editor.onSave = {
        editor.recordSave()
    }
    return editor
}

func makeOwnedEditor() -> EditorSession {
    let editor = EditorSession(title: "Forest Light")
    editor.onSave = { [weak editor] in
        editor?.recordSave()
    }
    return editor
}

weak var leakedObserver: EditorSession?
do {
    let editor = makeLeakingEditor()
    leakedObserver = editor
    editor.onSave?()
    precondition(editor.savedCount == 1)
}

precondition(leakedObserver != nil)
print("Strong capture kept editor alive: \(leakedObserver != nil)")

leakedObserver?.onSave = nil
precondition(leakedObserver == nil)
print("Breaking callback edge released editor: \(leakedObserver == nil)")

weak var ownedObserver: EditorSession?
do {
    let editor = makeOwnedEditor()
    ownedObserver = editor
    editor.onSave?()
    precondition(editor.savedCount == 1)
}

precondition(ownedObserver == nil)
print("Weak capture released editor: \(ownedObserver == nil)")
