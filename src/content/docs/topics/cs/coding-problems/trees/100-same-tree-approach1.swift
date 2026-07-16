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
    func isSameTree(_ p: TreeNode?, _ q: TreeNode?) -> Bool {
        guard let p, let q else { return p == nil && q == nil }
        return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cca3737013cfc1f29943e697b26cf43c1f118789e7eddf4592844ef4dd1c6a53
    let treeArgument1Case1 = makeTree([1, 2, 3])
    let treeArgument2Case1 = makeTree([1, 2, 3])
    expectEqual(Solution().isSameTree(treeArgument1Case1, treeArgument2Case1), true, "identical")
    let treeArgument1Case2 = makeTree([1, 2])
    let treeArgument2Case2 = makeTree([1, nil, 2])
    expectEqual(Solution().isSameTree(treeArgument1Case2, treeArgument2Case2), false, "different-shape")
    let treeArgument1Case3 = makeTree([1, 2, 1])
    let treeArgument2Case3 = makeTree([1, 1, 2])
    expectEqual(Solution().isSameTree(treeArgument1Case3, treeArgument2Case3), false, "different-value")
    let treeArgument1Case4 = makeTree([])
    let treeArgument2Case4 = makeTree([])
    expectEqual(Solution().isSameTree(treeArgument1Case4, treeArgument2Case4), true, "both-empty")
    // EXCLUDED_VECTOR orphaned-node: [[1,null,null,2],[1]] | Level-order values must not follow a closed frontier.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
