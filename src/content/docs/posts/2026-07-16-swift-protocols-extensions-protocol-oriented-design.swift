protocol Clock {
    func nowSeconds() -> Int
}

extension Clock {
    func seconds(since earlier: Int) -> Int {
        max(0, nowSeconds() - earlier)
    }
}

struct FixedClock: Clock {
    let instant: Int

    func nowSeconds() -> Int {
        instant
    }
}

struct OffsetClock: Clock {
    let base: any Clock
    let offset: Int

    func nowSeconds() -> Int {
        base.nowSeconds() + offset
    }
}

struct StampedNote: Equatable {
    let title: String
    let createdAt: Int
}

struct NoteStamper {
    private let clock: any Clock

    init(clock: any Clock) {
        self.clock = clock
    }

    func stamp(title: String) -> StampedNote {
        StampedNote(title: title, createdAt: clock.nowSeconds())
    }
}

func ages<C: Clock>(
    of notes: [StampedNote],
    using clock: C
) -> [Int] {
    notes.map { clock.seconds(since: $0.createdAt) }
}

let fixed = FixedClock(instant: 1_700_000_120)
let stamper = NoteStamper(clock: fixed)
let note = stamper.stamp(title: "Fog")
let shifted = OffsetClock(base: fixed, offset: 60)
let availableClocks: [any Clock] = [fixed, shifted]

precondition(note == StampedNote(title: "Fog", createdAt: 1_700_000_120))
precondition(fixed.seconds(since: 1_700_000_000) == 120)
precondition(fixed.seconds(since: 1_700_000_200) == 0)
precondition(ages(of: [note], using: shifted) == [60])
precondition(availableClocks.map { $0.nowSeconds() } == [1_700_000_120, 1_700_000_180])

print("Created: \(note.createdAt)")
print("Age: \(fixed.seconds(since: 1_700_000_000))")
print("Future age clamped: \(fixed.seconds(since: 1_700_000_200))")
print("Shifted age: \(ages(of: [note], using: shifted)[0])")
print("Clock instants: \(availableClocks.map { String($0.nowSeconds()) }.joined(separator: ", "))")
