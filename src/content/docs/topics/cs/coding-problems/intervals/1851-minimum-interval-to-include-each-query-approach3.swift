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

private struct RangeMinTree {
    private var values: [Int]
    private let count: Int
    init(count: Int) { self.count = count; values = Array(repeating: Int.max, count: max(1, count * 4)) }
    mutating func update(_ left: Int, _ right: Int, _ value: Int) { update(1, 0, count - 1, left, right, value) }
    private mutating func update(_ node: Int, _ low: Int, _ high: Int, _ left: Int, _ right: Int, _ value: Int) {
        if right < low || high < left { return }
        if left <= low && high <= right { values[node] = min(values[node], value); return }
        let middle = (low + high) / 2
        update(node * 2, low, middle, left, right, value)
        update(node * 2 + 1, middle + 1, high, left, right, value)
    }
    func query(_ index: Int) -> Int { query(1, 0, count - 1, index, Int.max) }
    private func query(_ node: Int, _ low: Int, _ high: Int, _ index: Int, _ best: Int) -> Int {
        let next = min(best, values[node])
        if low == high { return next }
        let middle = (low + high) / 2
        return index <= middle ? query(node * 2, low, middle, index, next) : query(node * 2 + 1, middle + 1, high, index, next)
    }
}
final class Solution {
    func minInterval(_ intervals: [[Int]], _ queries: [Int]) -> [Int] {
        let coordinates = Array(Set(intervals.flatMap { $0 } + queries)).sorted()
        let positions = Dictionary(uniqueKeysWithValues: coordinates.enumerated().map { ($0.element, $0.offset) })
        var tree = RangeMinTree(count: coordinates.count)
        for interval in intervals { tree.update(positions[interval[0]]!, positions[interval[1]]!, interval[1] - interval[0] + 1) }
        return queries.map { let answer = tree.query(positions[$0]!); return answer == Int.max ? -1 : answer }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:de4743e7f3a901a346833618320ae7e331586507a6cf440875fd001cbaa47860
    expectEqual(Solution().minInterval([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]), [3, 3, 1, 4], "overlapping-candidates")
    expectEqual(Solution().minInterval([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]), [2, -1, 4, 6], "queries-with-gaps")
    expectEqual(Solution().minInterval([[1, 5], [2, 3]], [2, 2, 3]), [2, 2, 2], "repeated-query")
    expectEqual(Solution().minInterval([[5, 5]], [5, 4]), [1, -1], "single-point-and-miss")
    // EXCLUDED_VECTOR empty-interval-list: [[],[1]] | The problem contract requires at least one interval.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
