import Foundation

public struct NoteID: RawRepresentable, Codable, Hashable, Sendable {
    public let rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }
}

public enum FieldNoteValidationError: Error, Equatable, Sendable {
    case blankTitle
}

public struct FieldNote: Identifiable, Codable, Equatable, Sendable {
    public let id: NoteID
    public let title: String
    public let body: String
    public let tags: [String]
    public let isFavorite: Bool
    public let createdAt: Date
    public let updatedAt: Date

    public init(
        id: NoteID,
        title: String,
        body: String = "",
        tags: [String] = [],
        isFavorite: Bool = false,
        createdAt: Date,
        updatedAt: Date
    ) throws {
        let normalizedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !normalizedTitle.isEmpty else {
            throw FieldNoteValidationError.blankTitle
        }

        self.id = id
        self.title = normalizedTitle
        self.body = body
        self.tags = Self.normalize(tags: tags)
        self.isFavorite = isFavorite
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }

    public func updating(
        title: String,
        body: String,
        tags: [String],
        at date: Date
    ) throws -> FieldNote {
        try FieldNote(
            id: id,
            title: title,
            body: body,
            tags: tags,
            isFavorite: isFavorite,
            createdAt: createdAt,
            updatedAt: date
        )
    }

    public func settingFavorite(_ favorite: Bool, at date: Date) -> FieldNote {
        do {
            return try FieldNote(
                id: id,
                title: title,
                body: body,
                tags: tags,
                isFavorite: favorite,
                createdAt: createdAt,
                updatedAt: date
            )
        } catch {
            preconditionFailure("A validated note could not preserve its title: \(error)")
        }
    }

    private static func normalize(tags: [String]) -> [String] {
        var seen: Set<String> = []

        return tags.compactMap { tag in
            let trimmed = tag.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmed.isEmpty else { return nil }

            let comparisonKey = trimmed.lowercased()
            guard seen.insert(comparisonKey).inserted else { return nil }
            return trimmed
        }
    }
}
