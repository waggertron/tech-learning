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
func hasCycle(_ head: ListNode?) -> Bool {
        var current = head
        while let node = current {
            if node.val == Int.min { return true }
            node.val = Int.min
            current = node.next
        }
        return false
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:fb2ebfd7b77cbd4c223ae87079bef92cad216fc3f8dd4434b3663e78d75a7f4c
    let cycle1 = makeCyclicList([3, 2, 0, -4], 1)
    expectEqual(Solution().hasCycle(cycle1), true, "cycle-to-middle")
    let cycle2 = makeCyclicList([1, 2], 0)
    expectEqual(Solution().hasCycle(cycle2), true, "cycle-to-head")
    let cycle3 = makeCyclicList([1, 2, 3], -1)
    expectEqual(Solution().hasCycle(cycle3), false, "no-cycle")
    let cycle4 = makeCyclicList([], -1)
    expectEqual(Solution().hasCycle(cycle4), false, "empty-list")
    // EXCLUDED_VECTOR position-out-of-range: [{"values":[1],"pos":1}] | The cycle position must name an existing node or be -1.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
