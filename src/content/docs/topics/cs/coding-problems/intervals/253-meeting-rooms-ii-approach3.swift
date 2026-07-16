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
    func minMeetingRooms(_ intervals: [[Int]]) -> Int {
        let starts = intervals.map { $0[0] }.sorted()
        let ends = intervals.map { $0[1] }.sorted()
        var startIndex = 0
        var endIndex = 0
        var active = 0
        var answer = 0
        while startIndex < starts.count {
            if starts[startIndex] < ends[endIndex] { active += 1; answer = max(answer, active); startIndex += 1 }
            else { active -= 1; endIndex += 1 }
        }
        return answer
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c89204beed27d9496877c9784abcfe61c6e055920b79e472380663d074a6a27b
    expectEqual(Solution().minMeetingRooms([[0, 30], [5, 10], [15, 20]]), 2, "two-rooms-required")
    expectEqual(Solution().minMeetingRooms([[7, 10], [2, 4]]), 1, "one-room-for-disjoint-meetings")
    expectEqual(Solution().minMeetingRooms([[0, 10], [10, 20]]), 1, "touching-meetings-reuse-room")
    expectEqual(Solution().minMeetingRooms([]), 0, "no-meetings")
    // EXCLUDED_VECTOR zero-length-meeting: [[[1,1]]] | Meeting start times must be less than end times.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
