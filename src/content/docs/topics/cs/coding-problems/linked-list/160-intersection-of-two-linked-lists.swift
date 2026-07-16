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
func getIntersectionNode(_ headA: ListNode?, _ headB: ListNode?) -> ListNode? {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:f2243f8e67c94b2452b7a25ebfe8fe3e18503c568089b4148a86fb20922ca5cb
    let intersection1 = makeIntersectingLists([4, 1], [5, 6, 1], [8, 4, 5])
    expectEqual(listValues(intersection1.sharedHead), [8, 4, 5], "shared-tail-shape")
    expectTrue(sameNode(Solution().getIntersectionNode(intersection1.headA, intersection1.headB), intersection1.sharedHead), "shared-tail")
    let intersection2 = makeIntersectingLists([2, 6, 4], [1, 5], [9])
    expectEqual(listValues(intersection2.sharedHead), [9], "shared-single-node-shape")
    expectTrue(sameNode(Solution().getIntersectionNode(intersection2.headA, intersection2.headB), intersection2.sharedHead), "shared-single-node")
    let intersection3 = makeIntersectingLists([2, 6, 4], [1, 5], [])
    expectEqual(listValues(intersection3.sharedHead), [], "no-intersection-shape")
    expectTrue(sameNode(Solution().getIntersectionNode(intersection3.headA, intersection3.headB), intersection3.sharedHead), "no-intersection")
    let intersection4 = makeIntersectingLists([], [], [1])
    expectEqual(listValues(intersection4.sharedHead), [1], "heads-are-shared-shape")
    expectTrue(sameNode(Solution().getIntersectionNode(intersection4.headA, intersection4.headB), intersection4.sharedHead), "heads-are-shared")
    // EXCLUDED_VECTOR empty-first-list: [{"prefixA":[],"prefixB":[2],"shared":[]}] | Both published input lists are non-empty.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
