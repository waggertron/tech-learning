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

final class Solution { func goodNodes(_ root: TreeNode?) -> Int { guard let root else { return 0 }; var stack: [(TreeNode, Int)] = [(root, root.val)], total = 0; while let entry = stack.popLast() { if entry.0.val >= entry.1 { total += 1 }; let maximum = max(entry.1, entry.0.val); if let left = entry.0.left { stack.append((left, maximum)) }; if let right = entry.0.right { stack.append((right, maximum)) } }; return total } }

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d3057142f798a29502041c4486ae18bda802bc4712b5b342714389da5fe2a6ae
    let treeArgument1Case1 = makeTree([3, 1, 4, 3, nil, 1, 5])
    expectEqual(Solution().goodNodes(treeArgument1Case1), 4, "classic")
    let treeArgument1Case2 = makeTree([3, 3, nil, 4, 2])
    expectEqual(Solution().goodNodes(treeArgument1Case2), 3, "left-branch")
    let treeArgument1Case3 = makeTree([1])
    expectEqual(Solution().goodNodes(treeArgument1Case3), 1, "single-node")
    // EXCLUDED_VECTOR empty-tree: [[]] | The published input contains at least one node.
    // EXCLUDED_VECTOR orphaned-node: [[1,null,null,2]] | Level-order values must not follow a closed frontier.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
