import Foundation
import FieldNotesCore
import FieldNotesTestSupport
import Testing

private func temporaryStore() throws -> URL {
    let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
    return directory.appendingPathComponent("notes.json")
}

@Test("Both adapters replace by identity and delete idempotently", arguments: [false, true])
func repositoryContract(fileBacked: Bool) async throws {
    let url = try temporaryStore()
    defer { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
    let repository: any NoteRepository = fileBacked ? FileNoteRepository(url: url) : InMemoryNoteRepository()
    let original = FieldNotesFixtures.redwood
    try await repository.save(original)
    try await repository.save(original)
    #expect(try await repository.load() == [original])
    let updated = try original.updating(title: "Changed", body: "Unicode: 海", tags: [" coast "], at: FieldNotesFixtures.secondDate)
    try await repository.save(updated)
    #expect(try await repository.load() == [updated])
    try await repository.delete(id: original.id)
    try await repository.delete(id: original.id)
    #expect(try await repository.load().isEmpty)
}

@Test("Both adapters give identical search and ordering", arguments: [false, true])
func libraryContract(fileBacked: Bool) async throws {
    let url = try temporaryStore()
    defer { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
    let repository: any NoteRepository = fileBacked ? FileNoteRepository(url: url) : InMemoryNoteRepository()
    try await repository.save(FieldNotesFixtures.redwood)
    try await repository.save(FieldNotesFixtures.tidePools)
    let library = NoteLibrary(repository: repository)
    #expect(try await library.notes().map(\.id) == [FieldNotesFixtures.redwood.id, FieldNotesFixtures.tidePools.id])
    #expect(try await library.notes(matching: "MORNING").map(\.id) == [FieldNotesFixtures.redwood.id])
}

@Test("File data survives a new adapter instance")
func fileReopen() async throws {
    let url = try temporaryStore()
    defer { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
    try await FileNoteRepository(url: url).save(FieldNotesFixtures.redwood)
    #expect(try await FileNoteRepository(url: url).load() == [FieldNotesFixtures.redwood])
}

@Test("Malformed and unsupported stores are preserved", arguments: [Data("not json".utf8), Data("{\"version\":99,\"notes\":[]}".utf8)])
func invalidStore(data: Data) async throws {
    let url = try temporaryStore()
    defer { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
    try data.write(to: url)
    let repository = FileNoteRepository(url: url)
    await #expect(throws: NoteStorageError.self) { try await repository.save(FieldNotesFixtures.redwood) }
    #expect(try Data(contentsOf: url) == data)
}

@Test("Failed replacement keeps the prior committed store readable")
func failedReplacement() async throws {
    let url = try temporaryStore()
    defer { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
    try await FileNoteRepository(url: url).save(FieldNotesFixtures.redwood)
    let before = try Data(contentsOf: url)
    let repository = FileNoteRepository(url: url, replace: { _, _ in throw NoteStorageError.writeFailed })
    await #expect(throws: NoteStorageError.writeFailed) { try await repository.delete(id: FieldNotesFixtures.redwood.id) }
    #expect(try Data(contentsOf: url) == before)
    #expect(try await FileNoteRepository(url: url).load() == [FieldNotesFixtures.redwood])
}

@Test("Draft save uses fixed identity and time and preserves creation on edit")
func draftSave() async throws {
    let repository = InMemoryNoteRepository()
    let save = SaveNote(library: NoteLibrary(repository: repository), now: { FieldNotesFixtures.firstDate })
    let id = NoteID(rawValue: "fixed-draft")
    let created = try await save(NoteDraft(title: "  Creek  ", body: "Observation", tags: "water, WATER", id: id))
    #expect(created.id == id)
    #expect(created.title == "Creek")
    #expect(created.tags == ["water"])
    #expect(created.createdAt == FieldNotesFixtures.firstDate)
    let edit = SaveNote(library: NoteLibrary(repository: repository), now: { FieldNotesFixtures.secondDate })
    let changed = try await edit(NoteDraft(note: created, title: "Revised"))
    #expect(changed.createdAt == created.createdAt)
    #expect(changed.updatedAt == FieldNotesFixtures.secondDate)
}

@Test("Save failure leaves input unchanged")
func draftFailure() async {
    let draft = NoteDraft(title: "Keep this draft", id: NoteID(rawValue: "retry-id"))
    let save = SaveNote(library: NoteLibrary(repository: FailingNoteRepository()))
    await #expect(throws: FieldNotesFixtureFailure.requested) { try await save(draft) }
    #expect(draft.title == "Keep this draft")
    #expect(draft.id.rawValue == "retry-id")
}

@Test("Tag and coordinate values reject invalid boundaries")
func valueBoundaries() throws {
    #expect(try Tag(" Trail ").value == "trail")
    #expect(throws: FieldNoteValidationError.invalidTag) { try Tag(String(repeating: "x", count: 25)) }
    #expect(throws: FieldNoteValidationError.invalidTag) { try Tag(" ") }
    #expect(try Coordinate(latitude: -90, longitude: 180).longitude == 180)
    #expect(throws: FieldNoteValidationError.invalidCoordinate) { try Coordinate(latitude: .nan, longitude: 0) }
    #expect(throws: FieldNoteValidationError.invalidCoordinate) { try Coordinate(latitude: 91, longitude: 0) }
}

@Test("Save reducer rejects duplicate requests and supports retry")
func saveTransitions() {
    var state = SaveState.idle
    #expect(state.reduce(.requested) == .save)
    #expect(state == .saving)
    #expect(state.reduce(.requested) == .none)
    #expect(state.reduce(.failed) == .none)
    #expect(state == .failed)
    #expect(state.reduce(.requested) == .save)
    #expect(state.reduce(.succeeded) == .none)
    #expect(state == .saved)
}

@Test("Tag flow handles empty, narrow, large, and mirrored rows")
func tagFlowBoundaries() {
    #expect(TagFlow.measure(sizes: [], width: 0).size.height == 0)
    let sizes = [FlowSize(width: 60, height: 20), FlowSize(width: 60, height: 40)]
    let layout = TagFlow.measure(sizes: sizes, width: 100, spacing: 8)
    #expect(layout.positions == [FlowPosition(x: 0, y: 0), FlowPosition(x: 0, y: 28)])
    #expect(layout.size.height == 68)
    let rtl = TagFlow.measure(sizes: sizes, width: 100, spacing: 8, rightToLeft: true)
    #expect(rtl.positions.map(\.x) == [40, 40])
    #expect(TagFlow.measure(sizes: [FlowSize(width: 200, height: 80)], width: 40).size.width == 40)
}

private actor ResourceGate {
    private var continuation: CheckedContinuation<Int, Never>?
    private var started = false
    func wait() async -> Int {
        started = true
        return await withCheckedContinuation { continuation = $0 }
    }
    func hasStarted() -> Bool { started }
    func finish(_ value: Int) { continuation?.resume(returning: value); continuation = nil }
}

@Test("Resource reload preserves content through failure and cancellation")
func resourceRecovery() async {
    let loader = ResourceLoader<Int>()
    await loader.load { 1 }
    await loader.load { throw NoteStorageError.readFailed }
    #expect(await loader.state.value == 1)
    let gate = ResourceGate()
    let task = Task { await loader.load { await gate.wait() } }
    while !(await gate.hasStarted()) { await Task.yield() }
    task.cancel()
    await gate.finish(2)
    await task.value
    #expect(await loader.state.value == 1)
}

@Test("New resource request wins over an older completion")
func resourceOrdering() async {
    let loader = ResourceLoader<Int>()
    let gate = ResourceGate()
    let old = Task { await loader.load { await gate.wait() } }
    while !(await gate.hasStarted()) { await Task.yield() }
    await loader.load { 2 }
    await gate.finish(1)
    await old.value
    #expect(await loader.state.value == 2)
}

@Test("Route parsing rejects unrelated or incomplete URLs")
func noteRoutes() throws {
    #expect(NoteRoute(url: try #require(URL(string: "fieldnotes://note/creek"))) == .note(NoteID(rawValue: "creek")))
    for raw in ["https://note/creek", "fieldnotes://other/creek", "fieldnotes://note", "fieldnotes://note/a/b"] {
        #expect(NoteRoute(url: try #require(URL(string: raw))) == nil)
    }
}

@Test("Decoded file notes must still satisfy title invariants")
func decodedInvalidTitle() async throws {
    let url = try temporaryStore()
    defer { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
    let data = Data("{\"version\":1,\"notes\":[{\"id\":{\"rawValue\":\"bad\"},\"title\":\"  \",\"body\":\"\",\"tags\":[],\"isFavorite\":false,\"createdAt\":0,\"updatedAt\":0}]}".utf8)
    try data.write(to: url)
    await #expect(throws: NoteStorageError.corruptStore) { try await FileNoteRepository(url: url).load() }
    #expect(try Data(contentsOf: url) == data)
}

@Test("Draft ignores empty tag fields and explains overlong input")
func draftTagValidation() async throws {
    let library = NoteLibrary(repository: InMemoryNoteRepository())
    let draft = NoteDraft(title: "Creek", tags: "water, , WATER, ")
    #expect(draft.canSave)
    #expect(try await SaveNote(library: library)(draft).tags == ["water"])
    let invalid = NoteDraft(title: "Creek", tags: String(repeating: "x", count: 25))
    #expect(!invalid.canSave)
    #expect(invalid.tagsError == "Keep each tag to 24 characters or fewer.")
}

private actor SuspendedSaveRepository: NoteRepository {
    private var continuation: CheckedContinuation<Void, any Error>?
    private var started = false
    func load() async throws -> [FieldNote] { [] }
    func delete(id: NoteID) async throws {}
    func save(_ note: FieldNote) async throws {
        started = true
        try await withCheckedThrowingContinuation { continuation = $0 }
    }
    func hasStarted() -> Bool { started }
    func fail() { continuation?.resume(throwing: NoteStorageError.writeFailed); continuation = nil }
}

@Test("Editor input stays locked through an awaited save and unlocks after failure")
func editorInputWhileSaving() async throws {
    let repository = SuspendedSaveRepository()
    let save = SaveNote(library: NoteLibrary(repository: repository))
    let draft = NoteDraft(title: "Submitted text", id: NoteID(rawValue: "locked-draft"))
    var state = SaveState.idle
    #expect(state.acceptsInput)
    #expect(state.reduce(.requested) == .save)
    let operation = Task { try await save(draft) }
    while !(await repository.hasStarted()) { await Task.yield() }
    #expect(!state.acceptsInput)
    #expect(state.reduce(.requested) == .none)
    await repository.fail()
    do {
        _ = try await operation.value
        Issue.record("Expected the injected save failure")
    } catch {
        _ = state.reduce(.failed)
    }
    #expect(state.acceptsInput)
    #expect(draft.title == "Submitted text")
    #expect(state.reduce(.requested) == .save)
    #expect(!state.acceptsInput)
    _ = state.reduce(.succeeded)
    #expect(!state.acceptsInput)
}
