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
