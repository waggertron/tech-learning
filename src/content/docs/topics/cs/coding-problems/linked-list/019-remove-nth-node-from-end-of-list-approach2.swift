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
func removeNthFromEnd(_ head: ListNode?, _ n: Int) -> ListNode? {
        let dummy = ListNode(0, head)
        var distanceFromEnd = 0
        func visit(_ node: ListNode?) {
            guard let node else { return }
            visit(node.next)
            distanceFromEnd += 1
            if distanceFromEnd == n + 1 {
                node.next = node.next?.next
            }
        }
        visit(dummy)
        return dummy.next
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:2ba84195d05cad8b191fc2fefddd2b96c08623e1d815415acd734a765c53e23e
    let argument1Case1 = makeList([1, 2, 3, 4, 5])
    expectEqual(listValues(Solution().removeNthFromEnd(argument1Case1, 2)), [1, 2, 3, 5], "remove-middle")
    let argument1Case2 = makeList([1, 2])
    expectEqual(listValues(Solution().removeNthFromEnd(argument1Case2, 2)), [2], "remove-head")
    let argument1Case3 = makeList([1, 2, 3])
    expectEqual(listValues(Solution().removeNthFromEnd(argument1Case3, 1)), [1, 2], "remove-tail")
    let argument1Case4 = makeList([1])
    expectEqual(listValues(Solution().removeNthFromEnd(argument1Case4, 1)), [], "single-node")
    // EXCLUDED_VECTOR n-exceeds-length: [[1,2],3] | n must stay within the list length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
