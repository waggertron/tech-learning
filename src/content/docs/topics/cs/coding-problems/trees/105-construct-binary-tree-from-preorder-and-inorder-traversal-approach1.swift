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

final class Solution {
    func buildTree(_ preorder: [Int], _ inorder: [Int]) -> TreeNode? { guard let rootValue = preorder.first, let middle = inorder.firstIndex(of: rootValue) else { return nil }; let root = TreeNode(rootValue); root.left = buildTree(Array(preorder[1..<(middle + 1)]), Array(inorder[..<middle])); root.right = buildTree(Array(preorder[(middle + 1)...]), Array(inorder[(middle + 1)...])); return root }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:f0ca07c2c05ca4c588c732ab20a824f347327b6334c262d665c6e25d6e224342
    expectEqual(treeValues(Solution().buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])), [3, 9, 20, nil, nil, 15, 7], "classic")
    expectEqual(treeValues(Solution().buildTree([3, 2, 1], [1, 2, 3])), [3, 2, nil, 1], "left-skewed")
    expectEqual(treeValues(Solution().buildTree([-1], [-1])), [-1], "single-node")
    // EXCLUDED_VECTOR length-mismatch: [[1,2],[2]] | Preorder and inorder traversals must have equal length.
    // EXCLUDED_VECTOR different-values: [[1,2],[1,3]] | Both traversals must contain the same distinct values.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
