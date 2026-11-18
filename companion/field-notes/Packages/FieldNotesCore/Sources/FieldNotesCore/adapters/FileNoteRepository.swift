import Foundation

public enum NoteStorageError: Error, Equatable, Sendable {
    case readFailed
    case corruptStore
    case unsupportedVersion(Int)
    case writeFailed
}

/// One application-owned actor serializes writes to one file. Separate processes
/// or multiple live actors targeting the same file require external coordination.
public actor FileNoteRepository: NoteRepository {
    private struct Store: Codable {
        let version: Int
        let notes: [FieldNote]
    }

    private let url: URL
    private let replace: @Sendable (Data, URL) throws -> Void

    /// A supplied replacement hook must preserve the destination on failure and
    /// publish the complete data on success, matching Foundation's atomic write.
    public init(
        url: URL,
        replace: @escaping @Sendable (Data, URL) throws -> Void = { data, url in
            try data.write(to: url, options: .atomic)
        }
    ) {
        self.url = url
        self.replace = replace
    }

    public func load() throws -> [FieldNote] {
        guard FileManager.default.fileExists(atPath: url.path) else { return [] }
        let data: Data
        do { data = try Data(contentsOf: url) }
        catch { throw NoteStorageError.readFailed }
        let store: Store
        do { store = try JSONDecoder().decode(Store.self, from: data) }
        catch { throw NoteStorageError.corruptStore }
        guard store.version == 1 else { throw NoteStorageError.unsupportedVersion(store.version) }
        guard Set(store.notes.map(\.id)).count == store.notes.count else {
            throw NoteStorageError.corruptStore
        }
        return store.notes
    }

    public func save(_ note: FieldNote) throws {
        var notes = try load()
        notes.removeAll { $0.id == note.id }
        notes.append(note)
        try commit(notes)
    }

    public func delete(id: NoteID) throws {
        let notes = try load()
        guard notes.contains(where: { $0.id == id }) else { return }
        try commit(notes.filter { $0.id != id })
    }

    private func commit(_ notes: [FieldNote]) throws {
        do {
            let data = try JSONEncoder().encode(Store(version: 1, notes: notes))
            try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
            try replace(data, url)
        } catch { throw NoteStorageError.writeFailed }
    }
}
