// LEETCODE_TYPE: Solution
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

// SWIFT_CATALOG_HELPER: BinaryHeap
struct BinaryHeap<Element> {
    private var elements: [Element] = []
    private let hasHigherPriority: (Element, Element) -> Bool

    init(hasHigherPriority: @escaping (Element, Element) -> Bool) {
        self.hasHigherPriority = hasHigherPriority
    }

    var count: Int { elements.count }
    var isEmpty: Bool { elements.isEmpty }
    var peek: Element? { elements.first }

    mutating func insert(_ element: Element) {
        elements.append(element)
        siftUp(from: elements.count - 1)
    }

    mutating func removeRoot() -> Element? {
        guard !elements.isEmpty else { return nil }
        if elements.count == 1 { return elements.removeLast() }

        elements.swapAt(0, elements.count - 1)
        let root = elements.removeLast()
        siftDown(from: 0)
        return root
    }

    private mutating func siftUp(from start: Int) {
        var child = start
        while child > 0 {
            let parent = (child - 1) / 2
            guard hasHigherPriority(elements[child], elements[parent]) else { return }
            elements.swapAt(child, parent)
            child = parent
        }
    }

    private mutating func siftDown(from start: Int) {
        var parent = start
        while true {
            let left = parent * 2 + 1
            guard left < elements.count else { return }
            let right = left + 1
            var candidate = left
            if right < elements.count && hasHigherPriority(elements[right], elements[left]) {
                candidate = right
            }
            guard hasHigherPriority(elements[candidate], elements[parent]) else { return }
            elements.swapAt(parent, candidate)
            parent = candidate
        }
    }
}

final class Solution {
    func topKFrequent(_ nums: [Int], _ k: Int) -> [Int] {
        var counts: [Int: Int] = [:]; for value in nums { counts[value, default: 0] += 1 }
        var heap = BinaryHeap<(Int, Int)> { a, b in a.0 == b.0 ? a.1 > b.1 : a.0 < b.0 }
        for (value, count) in counts { heap.insert((count, value)); if heap.count > k { _ = heap.removeRoot() } }
        var result: [(Int, Int)] = []; while let item = heap.removeRoot() { result.append(item) }
        return result.sorted { $0.0 == $1.0 ? $0.1 < $1.1 : $0.0 > $1.0 }.map(\.1)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:54bfc4ab19fd69dc6da698db9bdd2efa90c67e4784826b30c1e2bde33d5c8c12
    expectEqual(Solution().topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2], "canonical")
    expectEqual(Solution().topKFrequent([1], 1), [1], "single")
    expectEqual(Solution().topKFrequent([1, 2], 2), [1, 2], "all-values")
    expectEqual(Solution().topKFrequent([-1, -1, 2, 2, 2, 3], 2), [2, -1], "negative")
    expectEqual(Solution().topKFrequent([4, 4, 4, 5, 6], 1), [4], "dominant")
    // EXCLUDED_VECTOR invalid-k: [[1],0] | k is between one and the number of distinct values.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
