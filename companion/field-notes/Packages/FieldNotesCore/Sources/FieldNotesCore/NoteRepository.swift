/// Save replaces the value with the same ID; deleting an absent ID succeeds.
/// Load returns value copies in unspecified order. NoteLibrary supplies a total order.
/// Successful file writes survive a normal reopen; memory writes last for the actor lifetime.
/// A failed mutation leaves prior committed data intact. Cancellation is checked before
/// SaveNote submits a mutation; cancellation after commit does not undo a saved note.
public protocol NoteRepository: Sendable {
    func load() async throws -> [FieldNote]
    func save(_ note: FieldNote) async throws
    func delete(id: NoteID) async throws
}

public actor InMemoryNoteRepository: NoteRepository {
    private var notesByID: [NoteID: FieldNote]

    public init(notes: [FieldNote] = []) {
        notesByID = Dictionary(uniqueKeysWithValues: notes.map { ($0.id, $0) })
    }

    public func load() async throws -> [FieldNote] {
        Array(notesByID.values)
    }

    public func save(_ note: FieldNote) async throws {
        notesByID[note.id] = note
    }

    public func delete(id: NoteID) async throws {
        notesByID[id] = nil
    }
}
