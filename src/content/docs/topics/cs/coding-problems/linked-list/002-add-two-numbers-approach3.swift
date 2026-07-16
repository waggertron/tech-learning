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
func addTwoNumbers(_ l1: ListNode?, _ l2: ListNode?) -> ListNode? {
        add(l1, l2, carry: 0)
    }

    private func add(_ left: ListNode?, _ right: ListNode?, carry: Int) -> ListNode? {
        guard left != nil || right != nil || carry > 0 else { return nil }
        let sum = (left?.val ?? 0) + (right?.val ?? 0) + carry
        return ListNode(sum % 10, add(left?.next, right?.next, carry: sum / 10))
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:9a43b614d34d4d8dfdcc4b1239f8a0e614642707547d88b868fe1e4b172889cb
    let argument1Case1 = makeList([2, 4, 3])
    let argument2Case1 = makeList([5, 6, 4])
    expectEqual(listValues(Solution().addTwoNumbers(argument1Case1, argument2Case1)), [7, 0, 8], "carry-across-digits")
    let argument1Case2 = makeList([9, 9, 9, 9])
    let argument2Case2 = makeList([1])
    expectEqual(listValues(Solution().addTwoNumbers(argument1Case2, argument2Case2)), [0, 0, 0, 0, 1], "unequal-lengths")
    let argument1Case3 = makeList([0])
    let argument2Case3 = makeList([0])
    expectEqual(listValues(Solution().addTwoNumbers(argument1Case3, argument2Case3)), [0], "zero-plus-zero")
    let argument1Case4 = makeList([9])
    let argument2Case4 = makeList([9])
    expectEqual(listValues(Solution().addTwoNumbers(argument1Case4, argument2Case4)), [8, 1], "single-carry")
    // EXCLUDED_VECTOR empty-first-number: [[],[1]] | Each input number contains at least one node.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
