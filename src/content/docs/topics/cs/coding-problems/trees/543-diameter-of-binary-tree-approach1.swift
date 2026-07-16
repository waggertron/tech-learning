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

final class Solution { func diameterOfBinaryTree(_ root: TreeNode?) -> Int { guard let root else { return 0 }; return max(height(root.left) + height(root.right), max(diameterOfBinaryTree(root.left), diameterOfBinaryTree(root.right))) }; private func height(_ node: TreeNode?) -> Int { guard let node else { return 0 }; return 1 + max(height(node.left), height(node.right)) } }

func runTests() {
    // TEST_VECTORS_BEGIN sha256:bd009af6abdf21955e81d69f44bf1aa1f8f1d0bb07d9aea59213264c108195e3
    let treeArgument1Case1 = makeTree([1, 2, 3, 4, 5])
    expectEqual(Solution().diameterOfBinaryTree(treeArgument1Case1), 3, "classic")
    let treeArgument1Case2 = makeTree([1, 2])
    expectEqual(Solution().diameterOfBinaryTree(treeArgument1Case2), 1, "two-nodes")
    let treeArgument1Case3 = makeTree([1])
    expectEqual(Solution().diameterOfBinaryTree(treeArgument1Case3), 0, "single-node")
    let treeArgument1Case4 = makeTree([])
    expectEqual(Solution().diameterOfBinaryTree(treeArgument1Case4), 0, "empty-tree")
    // EXCLUDED_VECTOR orphaned-node: [[1,null,null,2]] | Level-order values must not follow a closed frontier.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
