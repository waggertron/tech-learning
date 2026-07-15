// LEETCODE_TYPE: TimeMap

func expectEqual<T: Equatable>(
    _ actual: T,
    _ expected: T,
    _ message: String = "",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard actual == expected else {
        let detail = message.isEmpty ? "values differ" : message
        fatalError("\(file):\(line): \(detail). Expected \(expected), got \(actual)")
    }
}

func expectTrue(
    _ condition: @autoclosure () -> Bool,
    _ message: String = "expected true",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard condition() else {
        fatalError("\(file):\(line): \(message)")
    }
}

func reportSuccess() {
    print("All Swift tests passed")
}

private struct TimeMapEntry {
    let timestamp: Int
    let value: String
}

final class TimeMap {
    private var values: [String: [TimeMapEntry]] = [:]

    init() {}

    func set(_ key: String, _ value: String, _ timestamp: Int) {
        values[key, default: []].append(TimeMapEntry(timestamp: timestamp, value: value))
    }

    func get(_ key: String, _ timestamp: Int) -> String {
        guard let entries = values[key] else { return "" }
        let insertionIndex = upperBound(entries, timestamp: timestamp)
        guard insertionIndex > 0 else { return "" }
        return entries[insertionIndex - 1].value
    }

    private func upperBound(_ entries: [TimeMapEntry], timestamp: Int) -> Int {
        var low = 0
        var high = entries.count
        while low < high {
            let middle = low + (high - low) / 2
            if entries[middle].timestamp <= timestamp {
                low = middle + 1
            } else {
                high = middle
            }
        }
        return low
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cf4d23abaa64548a94333272dc1be063e51de9f2106a9e536fc46e3860921b71
    let subject1 = TimeMap()
    subject1.set("foo", "bar", 1)
    expectEqual(subject1.get("foo", 1), "bar", "exact-and-prior-lookups[2]")
    expectEqual(subject1.get("foo", 3), "bar", "exact-and-prior-lookups[3]")
    subject1.set("foo", "bar2", 4)
    expectEqual(subject1.get("foo", 4), "bar2", "exact-and-prior-lookups[5]")
    expectEqual(subject1.get("foo", 5), "bar2", "exact-and-prior-lookups[6]")
    let subject2 = TimeMap()
    subject2.set("alpha", "one", 1)
    subject2.set("beta", "two", 2)
    expectEqual(subject2.get("alpha", 2), "one", "keys-remain-independent[3]")
    expectEqual(subject2.get("beta", 2), "two", "keys-remain-independent[4]")
    let subject3 = TimeMap()
    expectEqual(subject3.get("missing", 1), "", "missing-key[1]")
    let subject4 = TimeMap()
    subject4.set("foo", "bar", 2)
    expectEqual(subject4.get("foo", 1), "", "lookup-before-first-timestamp[2]")
    // EXCLUDED_VECTOR nonincreasing-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",2]},{"operation":"set","arguments":["foo","older",1]}]] | Set timestamps must increase for each key.
    // EXCLUDED_VECTOR empty-key: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["","bar",1]}]] | Keys must contain at least one lowercase letter.
    // EXCLUDED_VECTOR zero-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",0]}]] | Timestamps start at one in the problem contract.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
