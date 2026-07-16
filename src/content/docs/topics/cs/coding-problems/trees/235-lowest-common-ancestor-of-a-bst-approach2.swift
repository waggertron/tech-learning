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

final class Solution { func lowestCommonAncestor(_ root: TreeNode?, _ p: TreeNode?, _ q: TreeNode?) -> TreeNode? { guard let root, let p, let q else { return nil }; if p.val < root.val && q.val < root.val { return lowestCommonAncestor(root.left, p, q) }; if p.val > root.val && q.val > root.val { return lowestCommonAncestor(root.right, p, q) }; return root } }

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d18f098988617fa85605577f5ca92a40c39bf017f5380d66806f6bf67d9ac487
    let treeArgument1Case1 = makeTree([6, 2, 8, 0, 4, 7, 9, nil, nil, 3, 5])
    let treeNodeArgument2Case1 = findTreeNode(treeArgument1Case1, 2)
    let treeNodeArgument3Case1 = findTreeNode(treeArgument1Case1, 8)
    let expectedTreeNodeCase1 = findTreeNode(treeArgument1Case1, 6)
    expectTrue(sameTreeNode(Solution().lowestCommonAncestor(treeArgument1Case1, treeNodeArgument2Case1, treeNodeArgument3Case1), expectedTreeNodeCase1), "root-split")
    let treeArgument1Case2 = makeTree([6, 2, 8, 0, 4, 7, 9, nil, nil, 3, 5])
    let treeNodeArgument2Case2 = findTreeNode(treeArgument1Case2, 2)
    let treeNodeArgument3Case2 = findTreeNode(treeArgument1Case2, 4)
    let expectedTreeNodeCase2 = findTreeNode(treeArgument1Case2, 2)
    expectTrue(sameTreeNode(Solution().lowestCommonAncestor(treeArgument1Case2, treeNodeArgument2Case2, treeNodeArgument3Case2), expectedTreeNodeCase2), "ancestor-input")
    let treeArgument1Case3 = makeTree([1])
    let treeNodeArgument2Case3 = findTreeNode(treeArgument1Case3, 1)
    let treeNodeArgument3Case3 = findTreeNode(treeArgument1Case3, 1)
    let expectedTreeNodeCase3 = findTreeNode(treeArgument1Case3, 1)
    expectTrue(sameTreeNode(Solution().lowestCommonAncestor(treeArgument1Case3, treeNodeArgument2Case3, treeNodeArgument3Case3), expectedTreeNodeCase3), "single-root")
    // EXCLUDED_VECTOR missing-reference: [[2,1,3],1,4] | Both node references must exist in the tree.
    // EXCLUDED_VECTOR empty-tree: [[],1,1] | The published tree and both references are nonempty.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
