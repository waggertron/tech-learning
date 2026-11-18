import Foundation

public struct Tag: Hashable, Sendable {
    public let value: String

    public init(_ raw: String) throws {
        let normalized = raw.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard (1...24).contains(normalized.count) else { throw FieldNoteValidationError.invalidTag }
        value = normalized
    }
}

public struct Coordinate: Equatable, Sendable {
    public let latitude: Double
    public let longitude: Double

    public init(latitude: Double, longitude: Double) throws {
        guard latitude.isFinite, longitude.isFinite,
              (-90...90).contains(latitude), (-180...180).contains(longitude) else {
            throw FieldNoteValidationError.invalidCoordinate
        }
        self.latitude = latitude
        self.longitude = longitude
    }
}

public struct NoteDraft: Identifiable, Equatable, Sendable {
    public let id: NoteID
    public let createdAt: Date?
    public var title: String
    public var body: String
    public var tags: String
    public var isFavorite: Bool

    public init(title: String = "", body: String = "", tags: String = "", id: NoteID = NoteID(rawValue: UUID().uuidString)) {
        self.id = id
        self.createdAt = nil
        self.title = title
        self.body = body
        self.tags = tags
        self.isFavorite = false
    }

    public init(note: FieldNote, title: String? = nil) {
        id = note.id
        createdAt = note.createdAt
        self.title = title ?? note.title
        body = note.body
        tags = note.tags.joined(separator: ", ")
        isFavorite = note.isFavorite
    }

    public var titleError: String? {
        title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "Enter a title." : nil
    }

    public var parsedTags: [String] {
        tags.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
    }

    public var tagsError: String? {
        parsedTags.contains { $0.count > 24 } ? "Keep each tag to 24 characters or fewer." : nil
    }

    public var canSave: Bool { titleError == nil && tagsError == nil }
}

public struct SaveNote: Sendable {
    private let library: NoteLibrary
    private let now: @Sendable () -> Date

    public init(library: NoteLibrary, now: @escaping @Sendable () -> Date = { Date() }) {
        self.library = library
        self.now = now
    }

    @discardableResult
    public func callAsFunction(_ draft: NoteDraft) async throws -> FieldNote {
        let date = now()
        let tags = try draft.parsedTags.map { try Tag($0).value }
        let note = try FieldNote(
            id: draft.id, title: draft.title, body: draft.body, tags: tags,
            isFavorite: draft.isFavorite, createdAt: draft.createdAt ?? date, updatedAt: date
        )
        try Task.checkCancellation()
        try await library.save(note)
        return note
    }
}

public enum SaveEvent: Sendable { case requested, succeeded, failed }
public enum SaveEffect: Equatable, Sendable { case none, save }
public enum SaveState: Equatable, Sendable {
    case idle, saving, saved, failed

    /// A submitted snapshot cannot accept later edits that dismissal would discard.
    /// Failure restores editing; success stays locked until the editor dismisses.
    public var acceptsInput: Bool { self == .idle || self == .failed }

    public mutating func reduce(_ event: SaveEvent) -> SaveEffect {
        switch (self, event) {
        case (.idle, .requested), (.failed, .requested): self = .saving; return .save
        case (.saving, .succeeded): self = .saved
        case (.saving, .failed): self = .failed
        default: break
        }
        return .none
    }
}
