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
func mergeTwoLists(_ list1: ListNode?, _ list2: ListNode?) -> ListNode? {
        let dummy = ListNode()
        var tail = dummy
        var left = list1
        var right = list2
        while let leftNode = left, let rightNode = right {
            if leftNode.val <= rightNode.val {
                tail.next = leftNode
                left = leftNode.next
            } else {
                tail.next = rightNode
                right = rightNode.next
            }
            tail = tail.next ?? tail
        }
        tail.next = left ?? right
        return dummy.next
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:262d4b94300331ccd48c195bdaaadc69239aebf7a8cd3eabe2463be782c9da46
    let argument1Case1 = makeList([1, 2, 4])
    let argument2Case1 = makeList([1, 3, 4])
    expectEqual(listValues(Solution().mergeTwoLists(argument1Case1, argument2Case1)), [1, 1, 2, 3, 4, 4], "interleaved-values")
    let argument1Case2 = makeList([])
    let argument2Case2 = makeList([0])
    expectEqual(listValues(Solution().mergeTwoLists(argument1Case2, argument2Case2)), [0], "one-list-empty")
    let argument1Case3 = makeList([-3, -1, 2])
    let argument2Case3 = makeList([-2, 4])
    expectEqual(listValues(Solution().mergeTwoLists(argument1Case3, argument2Case3)), [-3, -2, -1, 2, 4], "negative-values")
    let argument1Case4 = makeList([])
    let argument2Case4 = makeList([])
    expectEqual(listValues(Solution().mergeTwoLists(argument1Case4, argument2Case4)), [], "both-empty")
    // EXCLUDED_VECTOR first-list-unsorted: [[2,1],[3]] | Each input list must be sorted in nondecreasing order.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
