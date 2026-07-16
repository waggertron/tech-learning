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

// SWIFT_CATALOG_HELPER: ListNode
final class ListNode {
    var val: Int
    var next: ListNode?

    init(_ val: Int = 0, _ next: ListNode? = nil) {
        self.val = val
        self.next = next
    }
}

func makeList(_ values: [Int]) -> ListNode? {
    guard let first = values.first else { return nil }
    let head = ListNode(first)
    var tail = head
    for value in values.dropFirst() {
        let node = ListNode(value)
        tail.next = node
        tail = node
    }
    return head
}

func makeLists(_ values: [[Int]]) -> [ListNode?] {
    values.map(makeList)
}

func listValues(_ head: ListNode?) -> [Int] {
    var result: [Int] = []
    var seen: Set<ObjectIdentifier> = []
    var current = head
    while let node = current {
        let identity = ObjectIdentifier(node)
        guard seen.insert(identity).inserted else { fatalError("Expected an acyclic list") }
        result.append(node.val)
        current = node.next
    }
    return result
}

func makeCyclicList(_ values: [Int], _ pos: Int) -> ListNode? {
    let nodes = values.map { ListNode($0) }
    for index in 0..<max(0, nodes.count - 1) {
        nodes[index].next = nodes[index + 1]
    }
    if !nodes.isEmpty && pos >= 0 && pos < nodes.count {
        nodes[nodes.count - 1].next = nodes[pos]
    }
    return nodes.first
}

struct IntersectingLists {
    let headA: ListNode?
    let headB: ListNode?
    let sharedHead: ListNode?
}

private func append(_ suffix: ListNode?, to prefix: [Int]) -> ListNode? {
    guard let head = makeList(prefix) else { return suffix }
    var tail = head
    while let next = tail.next {
        tail = next
    }
    tail.next = suffix
    return head
}

func makeIntersectingLists(
    _ prefixA: [Int],
    _ prefixB: [Int],
    _ shared: [Int]
) -> IntersectingLists {
    let sharedHead = makeList(shared)
    return IntersectingLists(
        headA: append(sharedHead, to: prefixA),
        headB: append(sharedHead, to: prefixB),
        sharedHead: sharedHead
    )
}

func sameNode(_ left: ListNode?, _ right: ListNode?) -> Bool {
    left === right
}

final class Solution {
func reorderList(_ head: ListNode?) {
        var deque: [ListNode] = []
        var current = head
        while let node = current {
            deque.append(node)
            current = node.next
        }
        guard !deque.isEmpty else { return }
        var left = 0
        var right = deque.count - 1
        var tail = deque[left]
        left += 1
        var takeRight = true
        while left <= right {
            let next = takeRight ? deque[right] : deque[left]
            if takeRight { right -= 1 } else { left += 1 }
            tail.next = next
            tail = next
            takeRight.toggle()
        }
        tail.next = nil
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:1d476ecd609b33bfc942c3e87634aa2b5316f8869a9a53ef88c0234850532770
    let argument1 = makeList([1, 2, 3, 4])
    Solution().reorderList(argument1)
    expectEqual(listValues(argument1), [1, 4, 2, 3], "even-length")
    let argument2 = makeList([1, 2, 3, 4, 5])
    Solution().reorderList(argument2)
    expectEqual(listValues(argument2), [1, 5, 2, 4, 3], "odd-length")
    let argument3 = makeList([1, 2])
    Solution().reorderList(argument3)
    expectEqual(listValues(argument3), [1, 2], "two-nodes")
    let argument4 = makeList([1])
    Solution().reorderList(argument4)
    expectEqual(listValues(argument4), [1], "single-node")
    // EXCLUDED_VECTOR empty-list: [[]] | The published problem requires at least one node.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
