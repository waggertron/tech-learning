// LEETCODE_TYPE: MedianFinder
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

final class MedianFinder {
    private var lower = BinaryHeap<Int>(hasHigherPriority: >)
    private var upper = BinaryHeap<Int>(hasHigherPriority: <)
    init() {}
    func addNum(_ num: Int) {
        if let top = lower.peek, num > top { upper.insert(num) } else { lower.insert(num) }
        if lower.count > upper.count + 1 { upper.insert(lower.removeRoot()!) }
        if upper.count > lower.count { lower.insert(upper.removeRoot()!) }
    }
    func findMedian() -> Double {
        if lower.count == upper.count { return Double(lower.peek! + upper.peek!) / 2.0 }
        return Double(lower.peek!)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:a96c431efff868a07121583775eab6cbad936bb7bf1ed5eb52b2e6d12a17b993
    let subject1 = MedianFinder()
    subject1.addNum(1)
    subject1.addNum(2)
    expectEqual(subject1.findMedian(), 1.5, "odd-and-even-counts[3]")
    subject1.addNum(3)
    expectEqual(subject1.findMedian(), 2, "odd-and-even-counts[5]")
    let subject2 = MedianFinder()
    subject2.addNum(-1)
    subject2.addNum(-2)
    expectEqual(subject2.findMedian(), -1.5, "negative-values[3]")
    let subject3 = MedianFinder()
    subject3.addNum(5)
    expectEqual(subject3.findMedian(), 5, "one-value[2]")
    // EXCLUDED_VECTOR median-before-add: [[{"operation":"init","arguments":[]},{"operation":"findMedian","arguments":[]}]] | The problem contract calls findMedian only after at least one value is present.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
