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
    func maxSlidingWindow(_ nums: [Int], _ k: Int) -> [Int] {
        var deque: [Int] = [], head = 0
        var result: [Int] = []
        for index in nums.indices {
            if head < deque.count && deque[head] <= index - k { head += 1 }
            while deque.count > head, let last = deque.last, nums[last] <= nums[index] { deque.removeLast() }
            deque.append(index)
            if index >= k - 1 { result.append(nums[deque[head]]) }
        }
        return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:e119d4661e34adab563b7385e8de354b091558299f453d372ed7b47d8c4e3664
    expectEqual(Solution().maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7], "canonical-windows")
    expectEqual(Solution().maxSlidingWindow([9, 8, 7, 6], 2), [9, 8, 7], "descending-values")
    expectEqual(Solution().maxSlidingWindow([-4, -2, -5], 2), [-2, -2], "negative-values")
    expectEqual(Solution().maxSlidingWindow([1], 1), [1], "single-element-window")
    expectEqual(Solution().maxSlidingWindow([2, 1, 5], 3), [5], "whole-array-window")
    // EXCLUDED_VECTOR zero-window: [[1,2],0] | The window size must be positive.
    // EXCLUDED_VECTOR window-too-large: [[1,2],3] | The window size cannot exceed the array length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
