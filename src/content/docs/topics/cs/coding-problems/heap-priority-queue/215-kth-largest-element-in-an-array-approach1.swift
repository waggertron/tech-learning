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
    func findKthLargest(_ nums: [Int], _ k: Int) -> Int { nums.sorted(by: >)[k - 1] }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:82781053aa4922ced8b4e0524dd7e7e06e1bbfd08875551f42ef4fc4f8167866
    expectEqual(Solution().findKthLargest([3, 2, 1, 5, 6, 4], 2), 5, "distinct-values")
    expectEqual(Solution().findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4, "duplicates-count-toward-rank")
    expectEqual(Solution().findKthLargest([1], 1), 1, "single-value")
    expectEqual(Solution().findKthLargest([2, 2, 2], 3), 2, "all-equal")
    // EXCLUDED_VECTOR zero-rank: [[1,2],0] | The problem contract requires k to be between 1 and the array length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
