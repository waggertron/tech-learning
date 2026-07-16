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
    func minCostConnectPoints(_ points: [[Int]]) -> Int {
        let n = points.count; if n <= 1 { return 0 }
        var edges: [(Int, Int, Int)] = []
        for i in 0..<n { for j in (i + 1)..<n { edges.append((i, j, abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1]))) } }
        var selected: [Int] = [], answer = Int.max
        func evaluate() {
            var parent = Array(0..<n)
            func find(_ value: Int) -> Int { var node = value; while parent[node] != node { node = parent[node] }; return node }
            var total = 0
            for index in selected { let edge = edges[index], a = find(edge.0), b = find(edge.1); if a == b { return }; parent[b] = a; total += edge.2 }
            answer = min(answer, total)
        }
        func choose(_ index: Int) { if selected.count == n - 1 { evaluate(); return }; if index == edges.count || selected.count + edges.count - index < n - 1 { return }; selected.append(index); choose(index + 1); selected.removeLast(); choose(index + 1) }
        choose(0); return answer
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:59e67a7d4d7da12a57a8f91b5f3fd7d3d407d3765d9f7dad67afcd9df604c679
    expectEqual(Solution().minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]), 20, "canonical")
    expectEqual(Solution().minCostConnectPoints([[3, 12], [-2, 5], [-4, 1]]), 18, "three-points")
    expectEqual(Solution().minCostConnectPoints([[0, 0], [1, 1]]), 2, "two-points")
    expectEqual(Solution().minCostConnectPoints([[0, 0], [0, 0], [1, 0]]), 1, "duplicate-point")
    expectEqual(Solution().minCostConnectPoints([[4, 7]]), 0, "single-point")
    // EXCLUDED_VECTOR empty-points: [[]] | At least one point is provided.
    // EXCLUDED_VECTOR ragged-point: [[[0,0],[1]]] | Every point contains two coordinates.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
