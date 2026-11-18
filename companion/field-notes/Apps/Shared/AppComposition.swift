import FieldNotesCore
import Foundation

/// Startup owns the store location. Both interfaces share this composition policy.
enum AppComposition {
    static func library(arguments: [String] = ProcessInfo.processInfo.arguments) -> NoteLibrary {
        do {
            let directory = try FileManager.default.url(
                for: .applicationSupportDirectory, in: .userDomainMask,
                appropriateFor: nil, create: true
            ).appendingPathComponent("FieldNotes", isDirectory: true)
            var storeName = "notes"
            var reset = false
            var failFirstSave = false
            var delaySave = false
            #if DEBUG
            if arguments.contains("--ui-testing") {
                if let index = arguments.firstIndex(of: "--store-name"), arguments.indices.contains(index + 1) {
                    let name = arguments[index + 1]
                    guard !name.isEmpty, name.allSatisfy({ $0.isLetter || $0.isNumber || $0 == "-" }) else {
                        throw NoteStorageError.readFailed
                    }
                    storeName = "test-" + name
                }
                reset = arguments.contains("--reset-store")
                failFirstSave = arguments.contains("--fail-first-save")
                delaySave = arguments.contains("--delay-save")
            }
            #endif
            let url = directory.appendingPathComponent(storeName + ".json")
            if reset, FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.removeItem(at: url)
            }
            var repository: any NoteRepository = FileNoteRepository(url: url)
            if failFirstSave { repository = FailFirstSaveRepository(base: repository) }
            if delaySave { repository = DelayedSaveRepository(base: repository) }
            return NoteLibrary(repository: repository)
        } catch {
            return NoteLibrary(repository: UnavailableNoteRepository())
        }
    }
}

private actor FailFirstSaveRepository: NoteRepository {
    let base: any NoteRepository
    var shouldFail = true
    init(base: any NoteRepository) { self.base = base }
    func load() async throws -> [FieldNote] { try await base.load() }
    func delete(id: NoteID) async throws { try await base.delete(id: id) }
    func save(_ note: FieldNote) async throws {
        if shouldFail { shouldFail = false; throw NoteStorageError.writeFailed }
        try await base.save(note)
    }
}

private struct UnavailableNoteRepository: NoteRepository {
    func load() async throws -> [FieldNote] { throw NoteStorageError.readFailed }
    func save(_ note: FieldNote) async throws { throw NoteStorageError.writeFailed }
    func delete(id: NoteID) async throws { throw NoteStorageError.writeFailed }
}

/// A debug-only selected test fixture makes the editing lock observable in UI journeys.
private actor DelayedSaveRepository: NoteRepository {
    let base: any NoteRepository
    init(base: any NoteRepository) { self.base = base }
    func load() async throws -> [FieldNote] { try await base.load() }
    func delete(id: NoteID) async throws { try await base.delete(id: id) }
    func save(_ note: FieldNote) async throws {
        try await Task.sleep(for: .seconds(2))
        try await base.save(note)
    }
}
