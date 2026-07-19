struct SyncEvent: Sendable {
    let noteID: Int
    let revision: Int
}

actor SyncLedger {
    private var revisions: [Int: Int] = [:]

    func record(_ event: SyncEvent) {
        revisions[event.noteID] = max(revisions[event.noteID, default: 0], event.revision)
    }

    func revision(for noteID: Int) -> Int {
        revisions[noteID, default: 0]
    }
}

@MainActor
final class SyncViewModel {
    private(set) var status = "Idle"

    func showSynced(count: Int) {
        status = "Synced \(count)"
    }
}

let ledger = SyncLedger()
await withTaskGroup(of: Void.self) { group in
    for revision in [1, 3, 2] {
        group.addTask {
            await ledger.record(SyncEvent(noteID: 42, revision: revision))
        }
    }
}

let revision = await ledger.revision(for: 42)
precondition(revision == 3)
print("Stored revision: \(revision)")

let viewModel = await MainActor.run { SyncViewModel() }
viewModel.showSynced(count: revision)
let status = await MainActor.run { viewModel.status }
precondition(status == "Synced 3")
print("Main actor status: \(status)")
