// LEETCODE_TYPE: Codec
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

// SWIFT_CATALOG_HELPER: TreeNode
final class TreeNode {
    var val: Int
    var left: TreeNode?
    var right: TreeNode?

    init(_ val: Int = 0, _ left: TreeNode? = nil, _ right: TreeNode? = nil) {
        self.val = val
        self.left = left
        self.right = right
    }
}

func makeTree(_ values: [Int?]) -> TreeNode? {
    guard let first = values.first, let rootValue = first else { return nil }
    let root = TreeNode(rootValue)
    var queue = [root]
    var readIndex = 0
    var valueIndex = 1

    while readIndex < queue.count && valueIndex < values.count {
        let node = queue[readIndex]
        readIndex += 1

        if let value = values[valueIndex] {
            node.left = TreeNode(value)
            if let left = node.left { queue.append(left) }
        }
        valueIndex += 1

        if valueIndex < values.count, let value = values[valueIndex] {
            node.right = TreeNode(value)
            if let right = node.right { queue.append(right) }
        }
        valueIndex += 1
    }

    return root
}

func treeValues(_ root: TreeNode?) -> [Int?] {
    guard let root else { return [] }
    var values: [Int?] = []
    var queue: [TreeNode?] = [root]
    var readIndex = 0

    while readIndex < queue.count {
        let node = queue[readIndex]
        readIndex += 1
        guard let node else {
            values.append(nil)
            continue
        }
        values.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
    }

    while !values.isEmpty && values[values.count - 1] == nil {
        values.removeLast()
    }
    return values
}

func findTreeNode(_ root: TreeNode?, _ value: Int) -> TreeNode? {
    guard let root else { return nil }
    var queue = [root]
    var readIndex = 0
    while readIndex < queue.count {
        let node = queue[readIndex]
        readIndex += 1
        if node.val == value { return node }
        if let left = node.left { queue.append(left) }
        if let right = node.right { queue.append(right) }
    }
    return nil
}

func sameTreeNode(_ left: TreeNode?, _ right: TreeNode?) -> Bool {
    left === right
}

final class Codec { func serialize(_ root: TreeNode?) -> String { guard let root else { return "" }; var tokens: [String] = [], queue: [TreeNode?] = [root], read = 0; while read < queue.count { let node = queue[read]; read += 1; if let node { tokens.append(String(node.val)); queue.append(node.left); queue.append(node.right) } else { tokens.append("#") } }; return tokens.joined(separator: ",") }; func deserialize(_ data: String) -> TreeNode? { if data.isEmpty { return nil }; let tokens = data.split(separator: ",", omittingEmptySubsequences: false); guard let value = Int(tokens[0]) else { return nil }; let root = TreeNode(value); var queue = [root], read = 0, index = 1; while read < queue.count && index < tokens.count { let node = queue[read]; read += 1; if tokens[index] != "#", let value = Int(tokens[index]) { node.left = TreeNode(value); if let left = node.left { queue.append(left) } }; index += 1; if index < tokens.count, tokens[index] != "#", let value = Int(tokens[index]) { node.right = TreeNode(value); if let right = node.right { queue.append(right) } }; index += 1 }; return root }; func roundTrip(_ root: TreeNode?) -> TreeNode? { deserialize(serialize(root)) } }

func runTests() {
    // TEST_VECTORS_BEGIN sha256:da9db57d3060867de738e8b9d5534342f7a793bbe5ac2b354b0851e94502c606
    let treeArgument1Case1 = makeTree([1, 2, 3, nil, nil, 4, 5])
    expectEqual(treeValues(Codec().roundTrip(treeArgument1Case1)), [1, 2, 3, nil, nil, 4, 5], "mixed-tree")
    let treeArgument1Case2 = makeTree([-1, -2, 3, nil, 4])
    expectEqual(treeValues(Codec().roundTrip(treeArgument1Case2)), [-1, -2, 3, nil, 4], "negative-values")
    let treeArgument1Case3 = makeTree([1])
    expectEqual(treeValues(Codec().roundTrip(treeArgument1Case3)), [1], "single-node")
    let treeArgument1Case4 = makeTree([])
    expectEqual(treeValues(Codec().roundTrip(treeArgument1Case4)), [], "empty-tree")
    // EXCLUDED_VECTOR orphaned-node: [[1,null,null,2]] | Level-order values must not follow a closed frontier.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
