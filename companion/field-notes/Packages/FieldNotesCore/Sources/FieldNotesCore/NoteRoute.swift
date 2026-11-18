import Foundation

/// Parsing is testable without registering a URL scheme or claiming universal-link delivery.
public enum NoteRoute: Equatable, Sendable {
    case note(NoteID)

    public init?(url: URL) {
        guard url.scheme == "fieldnotes", url.host == "note",
              url.pathComponents.count == 2,
              let rawID = url.pathComponents.last, !rawID.isEmpty else { return nil }
        self = .note(NoteID(rawValue: rawID))
    }
}
