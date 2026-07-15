// LEETCODE_TYPE: KthLargest
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

final class KthLargest {
    private let k: Int
    private var heap = BinaryHeap<Int>(hasHigherPriority: >)
    init(_ k: Int, _ nums: [Int]) { self.k = k; for value in nums { heap.insert(value) } }
    func add(_ val: Int) -> Int { heap.insert(val); var copy = heap; var answer = 0; for _ in 0..<k { answer = copy.removeRoot()! }; return answer }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:e44ad25f5d8e34319986f6f0ba8e0756245afbb927f5c36e832f43aae5b2f342
    let subject1 = KthLargest(3, [4, 5, 8, 2])
    expectEqual(subject1.add(3), 4, "canonical-stream[1]")
    expectEqual(subject1.add(5), 5, "canonical-stream[2]")
    expectEqual(subject1.add(10), 5, "canonical-stream[3]")
    expectEqual(subject1.add(9), 8, "canonical-stream[4]")
    expectEqual(subject1.add(4), 8, "canonical-stream[5]")
    let subject2 = KthLargest(2, [0])
    expectEqual(subject2.add(-1), -1, "negative-and-positive-values[1]")
    expectEqual(subject2.add(1), 0, "negative-and-positive-values[2]")
    let subject3 = KthLargest(1, [])
    expectEqual(subject3.add(-3), -3, "empty-seed-k-one[1]")
    // EXCLUDED_VECTOR zero-rank: [[{"operation":"init","arguments":[0,[]]}]] | The problem contract requires k to be positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
