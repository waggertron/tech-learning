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
// SWIFT_CATALOG_HELPER: GraphNode
final class Node {
    var val: Int
    var neighbors: [Node?]

    init(_ val: Int = 0, _ neighbors: [Node?] = []) {
        self.val = val
        self.neighbors = neighbors
    }
}

func makeGraph(_ adjacency: [[Int]]) -> Node? {
    guard !adjacency.isEmpty else { return nil }
    let nodes = adjacency.indices.map { Node($0 + 1) }
    for index in adjacency.indices {
        nodes[index].neighbors = adjacency[index].map { nodes[$0 - 1] }
    }
    return nodes[0]
}

func isValidClone(_ original: Node?, _ clone: Node?, _ expected: [[Int]]) -> Bool {
    if expected.isEmpty { return original == nil && clone == nil }
    guard let original, let clone else { return false }
    var originalIDs = Set<ObjectIdentifier>()
    var originalQueue = [original], originalHead = 0
    while originalHead < originalQueue.count {
        let node = originalQueue[originalHead]; originalHead += 1
        if !originalIDs.insert(ObjectIdentifier(node)).inserted { continue }
        originalQueue.append(contentsOf: node.neighbors.compactMap { $0 })
    }
    var rows = Array(repeating: [Int](), count: expected.count)
    var seen = Set<ObjectIdentifier>(), queue = [clone], head = 0
    while head < queue.count {
        let node = queue[head]; head += 1
        let id = ObjectIdentifier(node)
        if !seen.insert(id).inserted { continue }
        if originalIDs.contains(id) || node.val < 1 || node.val > expected.count { return false }
        rows[node.val - 1] = node.neighbors.compactMap { $0?.val }
        queue.append(contentsOf: node.neighbors.compactMap { $0 })
    }
    return seen.count == expected.count && rows == expected
}

final class Solution {
    func cloneGraph(_ node: Node?) -> Node? {
        guard let node else { return nil }
        var copies: [ObjectIdentifier: Node] = [:]
        func clone(_ current: Node) -> Node {
            let key = ObjectIdentifier(current)
            if let copy = copies[key] { return copy }
            let copy = Node(current.val)
            copies[key] = copy
            copy.neighbors = current.neighbors.map { $0.map(clone) }
            return copy
        }
        return clone(node)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:58bc33ea59714ed40178b0eeb4aa3261d75ebbe7519e3e5fc5cc65b4f74564ef
    let original1 = makeGraph([[2, 4], [1, 3], [2, 4], [1, 3]])
    expectTrue(isValidClone(original1, Solution().cloneGraph(original1), [[2, 4], [1, 3], [2, 4], [1, 3]]), "four-node-cycle")
    let original2 = makeGraph([[2], [1]])
    expectTrue(isValidClone(original2, Solution().cloneGraph(original2), [[2], [1]]), "two-node-cycle")
    let original3 = makeGraph([])
    expectTrue(isValidClone(original3, Solution().cloneGraph(original3), []), "empty-graph")
    // EXCLUDED_VECTOR unknown-neighbor: [[[2]]] | Every neighbor label must name a node in the adjacency list.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
