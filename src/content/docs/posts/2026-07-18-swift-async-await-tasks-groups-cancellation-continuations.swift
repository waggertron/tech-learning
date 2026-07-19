struct NoteAsset: Sendable {
    let kind: String
    let value: String
}

enum LoadError: Error {
    case missingPhoto
}

func loadMetadata() async throws -> NoteAsset {
    try await Task.sleep(for: .milliseconds(10))
    try Task.checkCancellation()
    return NoteAsset(kind: "metadata", value: "Tide Pools")
}

func loadPhoto() async throws -> NoteAsset {
    try await Task.sleep(for: .milliseconds(20))
    try Task.checkCancellation()
    return NoteAsset(kind: "photo", value: "tide-pools.heic")
}

func loadAssets() async throws -> [NoteAsset] {
    try await withThrowingTaskGroup(of: NoteAsset.self) { group in
        group.addTask { try await loadMetadata() }
        group.addTask { try await loadPhoto() }

        var assets: [NoteAsset] = []
        for try await asset in group {
            assets.append(asset)
        }
        return assets.sorted { $0.kind < $1.kind }
    }
}

func legacyTitle(
    completion: @escaping @Sendable (Result<String, Error>) -> Void
) {
    completion(.success("Forest Light"))
}

func bridgedTitle() async throws -> String {
    try await withCheckedThrowingContinuation { continuation in
        legacyTitle { result in
            continuation.resume(with: result)
        }
    }
}

let assets = try await loadAssets()
precondition(assets.map(\.kind) == ["metadata", "photo"])
print("Assets: \(assets.map(\.kind).joined(separator: ", "))")

let title = try await bridgedTitle()
precondition(title == "Forest Light")
print("Continuation title: \(title)")

let cancelled = Task {
    try await Task.sleep(for: .seconds(30))
    return "too late"
}
cancelled.cancel()

do {
    _ = try await cancelled.value
    preconditionFailure("Cancellation should throw")
} catch is CancellationError {
    print("Cancellation observed: true")
}
