enum NoteLoadState: Equatable {
    case idle
    case loading(attempt: Int)
    case loaded(notes: [String], fromCache: Bool)
    case failed(message: String, retryable: Bool)
}

func summary(of state: NoteLoadState) -> String {
    switch state {
    case .idle:
        return "Idle"
    case let .loading(attempt):
        return "Loading attempt \(attempt)"
    case let .loaded(notes, _) where notes.isEmpty:
        return "Loaded no notes"
    case let .loaded(notes, fromCache):
        let source = fromCache ? "cache" : "network"
        return "Loaded \(notes.count) notes from \(source): \(notes.joined(separator: ", "))"
    case let .failed(message, true):
        return "Failed: \(message) | retry available"
    case let .failed(message, false):
        return "Failed: \(message) | retry unavailable"
    }
}

func isRetryAvailable(for state: NoteLoadState) -> Bool {
    if case let .failed(_, retryable) = state {
        return retryable
    }

    return false
}

let timeline: [NoteLoadState] = [
    .idle,
    .loading(attempt: 1),
    .loaded(notes: ["Fog", "Tide"], fromCache: false),
    .failed(message: "Offline", retryable: true)
]

precondition(summary(of: timeline[0]) == "Idle")
precondition(summary(of: timeline[2]) == "Loaded 2 notes from network: Fog, Tide")
precondition(isRetryAvailable(for: timeline[3]))

for state in timeline {
    print(summary(of: state))
}

print("Retry available: \(isRetryAvailable(for: timeline[3]))")
