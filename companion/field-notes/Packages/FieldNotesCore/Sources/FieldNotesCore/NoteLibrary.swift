import Foundation

public enum NoteLibraryError: Error, Equatable, Sendable {
    case noteNotFound(NoteID)
}

public struct NoteLibrary: Sendable {
    private let repository: any NoteRepository

    public init(repository: any NoteRepository) {
        self.repository = repository
    }

    public func notes(matching query: String = "") async throws -> [FieldNote] {
        let allNotes = try await repository.load()
        let normalizedQuery = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()

        let matches = normalizedQuery.isEmpty
            ? allNotes
            : allNotes.filter { note in
                note.title.lowercased().contains(normalizedQuery)
                    || note.body.lowercased().contains(normalizedQuery)
                    || note.tags.contains { $0.lowercased().contains(normalizedQuery) }
            }

        return matches.sorted { left, right in
            if left.updatedAt != right.updatedAt {
                return left.updatedAt > right.updatedAt
            }
            return left.id.rawValue < right.id.rawValue
        }
    }

    public func save(_ note: FieldNote) async throws {
        try await repository.save(note)
    }

    public func delete(id: NoteID) async throws {
        try await repository.delete(id: id)
    }

    @discardableResult
    public func setFavorite(id: NoteID, to favorite: Bool, at date: Date) async throws -> FieldNote {
        guard let note = try await repository.load().first(where: { $0.id == id }) else {
            throw NoteLibraryError.noteNotFound(id)
        }

        let updated = note.settingFavorite(favorite, at: date)
        try await repository.save(updated)
        return updated
    }
}
