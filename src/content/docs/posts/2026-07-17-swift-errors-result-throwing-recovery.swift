enum ImportError: Error, Equatable, CustomStringConvertible {
    case emptyInput
    case malformedLine(line: Int, fieldCount: Int)
    case invalidIdentifier(line: Int, value: String)
    case emptyTitle(line: Int)
    case duplicateIdentifier(Int)
    case sourceUnavailable

    var description: String {
        switch self {
        case .emptyInput:
            return "import is empty"
        case let .malformedLine(line, fieldCount):
            return "line \(line) has \(fieldCount) fields"
        case let .invalidIdentifier(line, value):
            return "line \(line) has invalid identifier \"\(value)\""
        case let .emptyTitle(line):
            return "line \(line) has an empty title"
        case let .duplicateIdentifier(identifier):
            return "identifier \(identifier) appears more than once"
        case .sourceUnavailable:
            return "source unavailable"
        }
    }
}

enum TransportError: Error {
    case unavailable
}

struct ImportedNote: Equatable {
    let id: Int
    let title: String
    let tags: [String]
}

func decodeImport(_ text: String) throws(ImportError) -> [ImportedNote] {
    guard text.contains(where: { !$0.isWhitespace }) else {
        throw .emptyInput
    }

    var seenIdentifiers: Set<Int> = []
    var notes: [ImportedNote] = []

    for (offset, rawLine) in text.split(whereSeparator: { $0.isNewline }).enumerated() {
        let lineNumber = offset + 1
        let fields = rawLine.split(separator: "|", omittingEmptySubsequences: false)

        guard fields.count == 3 else {
            throw .malformedLine(line: lineNumber, fieldCount: fields.count)
        }

        let identifierText = String(fields[0])
        guard let identifier = Int(identifierText), identifier > 0 else {
            throw .invalidIdentifier(line: lineNumber, value: identifierText)
        }

        let title = String(fields[1])
        guard title.contains(where: { !$0.isWhitespace }) else {
            throw .emptyTitle(line: lineNumber)
        }

        guard seenIdentifiers.insert(identifier).inserted else {
            throw .duplicateIdentifier(identifier)
        }

        let tags = fields[2]
            .split(separator: ",")
            .map(String.init)

        notes.append(ImportedNote(id: identifier, title: title, tags: tags))
    }

    return notes
}

func loadImport(
    fetch: () throws -> String
) throws(ImportError) -> [ImportedNote] {
    do {
        return try decodeImport(fetch())
    } catch let error as ImportError {
        throw error
    } catch TransportError.unavailable {
        throw .sourceUnavailable
    } catch {
        throw .sourceUnavailable
    }
}

func recovery(for error: ImportError) -> String {
    switch error {
    case .sourceUnavailable:
        return "retry import"
    case .emptyInput, .malformedLine, .invalidIdentifier,
         .emptyTitle, .duplicateIdentifier:
        return "repair import"
    }
}

func capture<Success>(
    _ operation: @autoclosure () throws(ImportError) -> Success
) -> Result<Success, ImportError> {
    do {
        return .success(try operation())
    } catch {
        return .failure(error)
    }
}

let validText = """
1|Fog|ridge,morning
2|Rain|weather
"""

let invalidText = """
1|Fog|ridge
oops|Rain|weather
"""

let imported = try decodeImport(validText)
let validResult = capture(try decodeImport(validText))
let invalidResult = capture(try decodeImport(invalidText))
let transported = capture(try loadImport {
    throw TransportError.unavailable
})

guard case let .failure(invalidError) = invalidResult else {
    fatalError("Expected the invalid import to fail")
}
guard case let .failure(transportError) = transported else {
    fatalError("Expected the transport to fail")
}

precondition(imported.count == 2)
precondition(imported[0] == ImportedNote(id: 1, title: "Fog", tags: ["ridge", "morning"]))
precondition(validResult.map(\.count) == .success(2))
precondition(invalidError == .invalidIdentifier(line: 2, value: "oops"))
precondition(transportError == .sourceUnavailable)
precondition(recovery(for: transportError) == "retry import")

print("Imported: \(imported.count)")
print("First: \(imported[0].title)|\(imported[0].tags.joined(separator: ","))")
print("Mapped transport: \(transportError)")
print("Invalid row: \(invalidError)")
print("Result counts: \(try validResult.get().count), failure")
print("Recovery: \(recovery(for: transportError))")
