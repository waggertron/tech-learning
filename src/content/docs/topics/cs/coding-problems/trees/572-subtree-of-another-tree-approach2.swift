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

final class Solution { func isSubtree(_ root: TreeNode?, _ subRoot: TreeNode?) -> Bool { serialize(root).contains(serialize(subRoot)) }; private func serialize(_ node: TreeNode?) -> String { guard let node else { return "#" }; return "(\(node.val),\(serialize(node.left)),\(serialize(node.right)))" } }

func runTests() {
    // TEST_VECTORS_BEGIN sha256:25d88a6d27d1fa15d868cc46c5eb41131b7bbc5e67ce61550d7bd9ca93c0d26b
    let treeArgument1Case1 = makeTree([3, 4, 5, 1, 2])
    let treeArgument2Case1 = makeTree([4, 1, 2])
    expectEqual(Solution().isSubtree(treeArgument1Case1, treeArgument2Case1), true, "contained")
    let treeArgument1Case2 = makeTree([3, 4, 5, 1, 2, nil, nil, nil, nil, 0])
    let treeArgument2Case2 = makeTree([4, 1, 2])
    expectEqual(Solution().isSubtree(treeArgument1Case2, treeArgument2Case2), false, "extra-descendant")
    let treeArgument1Case3 = makeTree([1])
    let treeArgument2Case3 = makeTree([1])
    expectEqual(Solution().isSubtree(treeArgument1Case3, treeArgument2Case3), true, "same-single-node")
    // EXCLUDED_VECTOR empty-root: [[],[1]] | The published root tree is nonempty.
    // EXCLUDED_VECTOR empty-subtree: [[1],[]] | The published subtree is nonempty.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
