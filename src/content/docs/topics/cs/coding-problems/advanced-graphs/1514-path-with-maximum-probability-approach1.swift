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
    func maxProbability(_ n: Int, _ edges: [[Int]], _ succProb: [Double], _ start: Int, _ end: Int) -> Double {
        var best = Array(repeating: 0.0, count: n); best[start] = 1.0
        if n > 1 { for _ in 0..<(n - 1) { var next = best, changed = false; for index in edges.indices { let u = edges[index][0], v = edges[index][1], chance = succProb[index]; if best[u] * chance > next[v] { next[v] = best[u] * chance; changed = true }; if best[v] * chance > next[u] { next[u] = best[v] * chance; changed = true } }; best = next; if !changed { break } } }
        return best[end]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:5a1b75d24b263ad0e6e3e2929ace0c642a90ab63c483fca60cc7e604af81243b
    expectTrue(abs(Solution().maxProbability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2) - 0.25) <= 1e-9 * max(1.0, abs(0.25)), "indirect-best")
    expectTrue(abs(Solution().maxProbability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2) - 0.3) <= 1e-9 * max(1.0, abs(0.3)), "direct-best")
    expectTrue(abs(Solution().maxProbability(3, [[0, 1]], [0.5], 0, 2) - 0) <= 1e-9 * max(1.0, abs(0)), "unreachable")
    expectTrue(abs(Solution().maxProbability(3, [[0, 1]], [0.5], 1, 1) - 1) <= 1e-9 * max(1.0, abs(1)), "same-node")
    expectTrue(abs(Solution().maxProbability(1, [], [], 0, 0) - 1) <= 1e-9 * max(1.0, abs(1)), "one-node")
    // EXCLUDED_VECTOR zero-nodes: [0,[],[],0,0] | The graph has at least one node.
    // EXCLUDED_VECTOR probability-count: [2,[[0,1]],[],0,1] | Each edge has one matching success probability.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
