import Foundation
import FieldNotesCore

public enum FieldNotesFixtureFailure: Error, Equatable, Sendable {
    case requested
}

public enum FieldNotesFixtures {
    public static let firstDate = Date(timeIntervalSince1970: 1_700_000_000)
    public static let secondDate = Date(timeIntervalSince1970: 1_700_003_600)

    public static let redwood = makeNote(
        id: "note-redwood",
        title: "Redwood trail",
        body: "Morning fog along the north trail.",
        tags: ["forest", "morning"],
        isFavorite: true,
        createdAt: firstDate,
        updatedAt: secondDate
    )

    public static let tidePools = makeNote(
        id: "note-tide-pools",
        title: "Tide pools",
        body: "Anemones near the south rocks.",
        tags: ["coast"],
        createdAt: firstDate,
        updatedAt: firstDate
    )

    public static var all: [FieldNote] {
        [redwood, tidePools]
    }

    public static func repository() -> InMemoryNoteRepository {
        InMemoryNoteRepository(notes: all)
    }

    private static func makeNote(
        id: String,
        title: String,
        body: String,
        tags: [String],
        isFavorite: Bool = false,
        createdAt: Date,
        updatedAt: Date
    ) -> FieldNote {
        do {
            return try FieldNote(
                id: NoteID(rawValue: id),
                title: title,
                body: body,
                tags: tags,
                isFavorite: isFavorite,
                createdAt: createdAt,
                updatedAt: updatedAt
            )
        } catch {
            preconditionFailure("A deterministic Field Notes fixture is invalid: \(error)")
        }
    }
}

public actor FailingNoteRepository: NoteRepository {
    public init() {}

    public func load() async throws -> [FieldNote] {
        throw FieldNotesFixtureFailure.requested
    }

    public func save(_ note: FieldNote) async throws {
        throw FieldNotesFixtureFailure.requested
    }

    public func delete(id: NoteID) async throws {
        throw FieldNotesFixtureFailure.requested
    }
}
