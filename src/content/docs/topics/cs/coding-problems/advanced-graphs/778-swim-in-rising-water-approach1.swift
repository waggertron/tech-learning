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
    func swimInWater(_ grid: [[Int]]) -> Int {
        let n = grid.count, directions = [(1,0),(-1,0),(0,1),(0,-1)]
        func canReach(_ time: Int) -> Bool { if grid[0][0] > time { return false }; var seen = Array(repeating: Array(repeating: false, count: n), count: n), queue = [(0,0)], index = 0; seen[0][0] = true; while index < queue.count { let (row,col) = queue[index]; index += 1; if row == n - 1 && col == n - 1 { return true }; for (dr,dc) in directions { let r=row+dr,c=col+dc; if r>=0 && r<n && c>=0 && c<n && !seen[r][c] && grid[r][c] <= time { seen[r][c] = true; queue.append((r,c)) } } }; return false }
        var low = max(grid[0][0], grid[n - 1][n - 1]), high = grid.flatMap { $0 }.max()!; while low < high { let middle = low + (high - low) / 2; if canReach(middle) { high = middle } else { low = middle + 1 } }; return low
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:687b0416929a3f707d28744b07f490b01a1a5554bcbedd71317e0ad8b40ac749
    expectEqual(Solution().swimInWater([[0, 2], [1, 3]]), 3, "two-by-two")
    expectEqual(Solution().swimInWater([[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]), 16, "winding-five")
    expectEqual(Solution().swimInWater([[3, 2], [0, 1]]), 3, "descending-start")
    expectEqual(Solution().swimInWater([[0, 1, 2], [5, 4, 3], [6, 7, 8]]), 8, "snake-three")
    expectEqual(Solution().swimInWater([[7]]), 7, "single-cell")
    // EXCLUDED_VECTOR empty-grid: [[]] | The grid is a nonempty square.
    // EXCLUDED_VECTOR ragged-grid: [[[0,1],[2]]] | The grid is square.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
