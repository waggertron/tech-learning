// LEETCODE_TYPE: LRUCache
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

final class LRUCache {
    private let capacity: Int
    private var entries: [(key: Int, value: Int)] = []

    init(_ capacity: Int) {
        self.capacity = capacity
    }

    func get(_ key: Int) -> Int {
        guard let index = entries.firstIndex(where: { $0.key == key }) else { return -1 }
        let entry = entries.remove(at: index)
        entries.append(entry)
        return entry.value
    }

    func put(_ key: Int, _ value: Int) {
        if let index = entries.firstIndex(where: { $0.key == key }) {
            entries.remove(at: index)
        }
        entries.append((key, value))
        if entries.count > capacity {
            entries.removeFirst()
        }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:f3bf00711ce9a2a8d1225cc7c7e80f04af6ee3b8d7f2e35883fcb953fa11b270
    let subject1 = LRUCache(2)
    subject1.put(1, 1)
    subject1.put(2, 2)
    expectEqual(subject1.get(1), 1, "canonical-eviction[3]")
    subject1.put(3, 3)
    expectEqual(subject1.get(2), -1, "canonical-eviction[5]")
    subject1.put(4, 4)
    expectEqual(subject1.get(1), -1, "canonical-eviction[7]")
    expectEqual(subject1.get(3), 3, "canonical-eviction[8]")
    expectEqual(subject1.get(4), 4, "canonical-eviction[9]")
    let subject2 = LRUCache(2)
    subject2.put(1, 1)
    subject2.put(1, 9)
    expectEqual(subject2.get(1), 9, "update-existing-key[3]")
    let subject3 = LRUCache(2)
    subject3.put(1, 1)
    subject3.put(2, 2)
    expectEqual(subject3.get(1), 1, "get-refreshes-recency[3]")
    subject3.put(3, 3)
    expectEqual(subject3.get(2), -1, "get-refreshes-recency[5]")
    let subject4 = LRUCache(1)
    subject4.put(1, 1)
    subject4.put(2, 2)
    expectEqual(subject4.get(1), -1, "capacity-one[3]")
    expectEqual(subject4.get(2), 2, "capacity-one[4]")
    // EXCLUDED_VECTOR zero-capacity: [[{"operation":"init","arguments":[0]}]] | Capacity must be at least one.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
