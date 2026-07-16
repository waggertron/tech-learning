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
    func isValidBST(_ root: TreeNode?) -> Bool {
        guard let root else { return true }
        if let maximum = maximum(root.left), maximum >= root.val { return false }
        if let minimum = minimum(root.right), minimum <= root.val { return false }
        return isValidBST(root.left) && isValidBST(root.right)
    }
    private func maximum(_ node: TreeNode?) -> Int? { guard let node else { return nil }; return max(node.val, max(maximum(node.left) ?? node.val, maximum(node.right) ?? node.val)) }
    private func minimum(_ node: TreeNode?) -> Int? { guard let node else { return nil }; return min(node.val, min(minimum(node.left) ?? node.val, minimum(node.right) ?? node.val)) }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d5f540863bef5eb830a9d9a2269cbc94a58915adec5fb5d91e9a70bc4bdf4b6d
    let treeArgument1Case1 = makeTree([2, 1, 3])
    expectEqual(Solution().isValidBST(treeArgument1Case1), true, "three-node-valid")
    let treeArgument1Case2 = makeTree([5, 1, 4, nil, nil, 3, 6])
    expectEqual(Solution().isValidBST(treeArgument1Case2), false, "right-subtree-violation")
    let treeArgument1Case3 = makeTree([2, 2, 2])
    expectEqual(Solution().isValidBST(treeArgument1Case3), false, "duplicate-values")
    let treeArgument1Case4 = makeTree([])
    expectEqual(Solution().isValidBST(treeArgument1Case4), true, "empty-tree")
    let treeArgument1Case5 = makeTree([1])
    expectEqual(Solution().isValidBST(treeArgument1Case5), true, "single-node")
    // EXCLUDED_VECTOR orphaned-node: [[1,null,null,2]] | Level-order values must not follow a closed frontier.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
