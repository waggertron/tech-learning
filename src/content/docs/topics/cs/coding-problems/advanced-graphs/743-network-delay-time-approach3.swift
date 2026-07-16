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
    func networkDelayTime(_ times: [[Int]], _ n: Int, _ k: Int) -> Int {
        var graph = Array(repeating: [(Int, Int)](), count: n + 1); for edge in times { graph[edge[0]].append((edge[1], edge[2])) }
        let infinity = Int.max / 4; var distance = Array(repeating: infinity, count: n + 1); distance[k] = 0
        var queue = BinaryHeap<(Int, Int)>(hasHigherPriority: { $0.0 < $1.0 }); queue.insert((0, k))
        while let (elapsed, node) = queue.removeRoot() { if elapsed != distance[node] { continue }; for (neighbor, weight) in graph[node] { let candidate = elapsed + weight; if candidate < distance[neighbor] { distance[neighbor] = candidate; queue.insert((candidate, neighbor)) } } }
        let answer = distance[1...n].max()!; return answer == infinity ? -1 : answer
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:a0e029042829f077fa69346a749eaec9fe11b65a5561b2e4598e32d046e7ddec
    expectEqual(Solution().networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), 2, "canonical")
    expectEqual(Solution().networkDelayTime([[1, 2, 1]], 2, 1), 1, "single-edge")
    expectEqual(Solution().networkDelayTime([[1, 2, 1]], 2, 2), -1, "unreachable")
    expectEqual(Solution().networkDelayTime([[1, 2, 2], [2, 3, 2], [1, 3, 10]], 3, 1), 4, "choose-shorter")
    expectEqual(Solution().networkDelayTime([], 1, 1), 0, "one-node")
    // EXCLUDED_VECTOR zero-nodes: [[],0,0] | The network has at least one node.
    // EXCLUDED_VECTOR source-out-of-range: [[],2,3] | The source label is within the network.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
