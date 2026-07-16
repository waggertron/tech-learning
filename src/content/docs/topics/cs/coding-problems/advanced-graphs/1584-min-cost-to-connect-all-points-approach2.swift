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
        let n = points.count; if n <= 1 { return 0 }; var edges: [(Int, Int, Int)] = []
        for i in 0..<n { for j in (i + 1)..<n { edges.append((abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1]), i, j)) } }; edges.sort { $0.0 < $1.0 }
        var parent = Array(0..<n), rank = Array(repeating: 0, count: n)
        func find(_ value: Int) -> Int { var node = value; while parent[node] != node { node = parent[node] }; return node }
        var total = 0, used = 0
        for edge in edges { var a = find(edge.1), b = find(edge.2); if a == b { continue }; if rank[a] < rank[b] { swap(&a, &b) }; parent[b] = a; if rank[a] == rank[b] { rank[a] += 1 }; total += edge.0; used += 1; if used == n - 1 { break } }
        return total
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
