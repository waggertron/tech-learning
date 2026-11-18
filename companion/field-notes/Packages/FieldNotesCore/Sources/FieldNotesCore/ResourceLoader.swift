public enum ResourceState<Value: Sendable>: Sendable {
    case idle
    case loading(previous: Value?)
    case loaded(Value)
    case failed(previous: Value?)

    public var value: Value? {
        switch self {
        case .idle: nil
        case .loading(let value), .failed(let value): value
        case .loaded(let value): value
        }
    }
}

/// Latest request wins even when a provider ignores cancellation.
public actor ResourceLoader<Value: Sendable> {
    public private(set) var state: ResourceState<Value> = .idle
    private var generation = 0
    public init() {}

    public func load(_ fetch: @Sendable () async throws -> Value) async {
        generation += 1
        let request = generation
        let previous = state.value
        state = .loading(previous: previous)
        do {
            let value = try await fetch()
            try Task.checkCancellation()
            guard request == generation else { return }
            state = .loaded(value)
        } catch {
            guard request == generation else { return }
            if error is CancellationError {
                if let previous { state = .loaded(previous) } else { state = .idle }
            } else { state = .failed(previous: previous) }
        }
    }
}
