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

// SWIFT_CATALOG_HELPER: RandomListNode
final class Node {
    var val: Int
    var next: Node?
    var random: Node?

    init(_ val: Int = 0, _ next: Node? = nil, _ random: Node? = nil) {
        self.val = val
        self.next = next
        self.random = random
    }
}

struct RandomListEntry: Equatable {
    let value: Int
    let randomIndex: Int?
}

func makeRandomList(_ entries: [RandomListEntry]) -> Node? {
    let nodes = entries.map { Node($0.value) }
    for index in nodes.indices {
        if index + 1 < nodes.count {
            nodes[index].next = nodes[index + 1]
        }
        if let randomIndex = entries[index].randomIndex,
           randomIndex >= 0,
           randomIndex < nodes.count {
            nodes[index].random = nodes[randomIndex]
        }
    }
    return nodes.first
}

private func randomListNodes(_ head: Node?) -> [Node] {
    var result: [Node] = []
    var seen: Set<ObjectIdentifier> = []
    var current = head
    while let node = current {
        let identity = ObjectIdentifier(node)
        guard seen.insert(identity).inserted else { break }
        result.append(node)
        current = node.next
    }
    return result
}

private func randomListEntries(_ head: Node?) -> [RandomListEntry]? {
    let nodes = randomListNodes(head)
    let indexes = Dictionary(uniqueKeysWithValues: nodes.enumerated().map {
        (ObjectIdentifier($0.element), $0.offset)
    })
    var entries: [RandomListEntry] = []
    for node in nodes {
        let randomIndex: Int?
        if let random = node.random {
            guard let index = indexes[ObjectIdentifier(random)] else { return nil }
            randomIndex = index
        } else {
            randomIndex = nil
        }
        entries.append(RandomListEntry(value: node.val, randomIndex: randomIndex))
    }
    return entries
}

func isValidRandomListClone(
    _ original: Node?,
    _ clone: Node?,
    _ expected: [RandomListEntry]
) -> Bool {
    let originalNodes = randomListNodes(original)
    let cloneNodes = randomListNodes(clone)
    guard originalNodes.count == cloneNodes.count else { return false }
    if let originalLast = originalNodes.last, originalLast.next != nil { return false }
    if let cloneLast = cloneNodes.last, cloneLast.next != nil { return false }
    guard randomListEntries(original) == expected else { return false }
    guard randomListEntries(clone) == expected else { return false }
    return zip(originalNodes, cloneNodes).allSatisfy { pair in
        pair.0 !== pair.1
    }
}

final class Solution {
func copyRandomList(_ head: Node?) -> Node? {
        guard let head else { return nil }
        var current: Node? = head
        while let node = current {
            let copy = Node(node.val, node.next)
            node.next = copy
            current = copy.next
        }
        current = head
        while let node = current {
            node.next?.random = node.random?.next
            current = node.next?.next
        }
        let copyHead = head.next
        current = head
        while let node = current {
            let copy = node.next
            node.next = copy?.next
            copy?.next = copy?.next?.next
            current = node.next
        }
        return copyHead
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:75b43d8709f51370fb35743a94aeea1457cef8d882a4a769c2e2277e4df335f7
    let original1 = makeRandomList([RandomListEntry(value: 7, randomIndex: nil), RandomListEntry(value: 13, randomIndex: 0), RandomListEntry(value: 11, randomIndex: 4), RandomListEntry(value: 10, randomIndex: 2), RandomListEntry(value: 1, randomIndex: 0)])
    expectTrue(isValidRandomListClone(original1, Solution().copyRandomList(original1), [RandomListEntry(value: 7, randomIndex: nil), RandomListEntry(value: 13, randomIndex: 0), RandomListEntry(value: 11, randomIndex: 4), RandomListEntry(value: 10, randomIndex: 2), RandomListEntry(value: 1, randomIndex: 0)]), "canonical-cross-links")
    let original2 = makeRandomList([RandomListEntry(value: 1, randomIndex: 0)])
    expectTrue(isValidRandomListClone(original2, Solution().copyRandomList(original2), [RandomListEntry(value: 1, randomIndex: 0)]), "self-reference")
    let original3 = makeRandomList([RandomListEntry(value: -1, randomIndex: nil), RandomListEntry(value: 2, randomIndex: nil)])
    expectTrue(isValidRandomListClone(original3, Solution().copyRandomList(original3), [RandomListEntry(value: -1, randomIndex: nil), RandomListEntry(value: 2, randomIndex: nil)]), "all-random-nil")
    let original4 = makeRandomList([])
    expectTrue(isValidRandomListClone(original4, Solution().copyRandomList(original4), []), "empty-list")
    // EXCLUDED_VECTOR random-index-out-of-range: [[{"value":1,"randomIndex":1}]] | Random indexes must name an existing node.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
