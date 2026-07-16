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

final class Solution { func kthSmallest(_ root: TreeNode?, _ k: Int) -> Int { var stack: [TreeNode] = [], current = root, remaining = k; while current != nil || !stack.isEmpty { while let node = current { stack.append(node); current = node.left }; let node = stack.removeLast(); remaining -= 1; if remaining == 0 { return node.val }; current = node.right }; return 0 } }

func runTests() {
    // TEST_VECTORS_BEGIN sha256:05d260ebe935776c411099935419a1f630bce9cea3cab9345bd360ae05e865e0
    let treeArgument1Case1 = makeTree([5, 3, 6, 2, 4, nil, nil, 1])
    expectEqual(Solution().kthSmallest(treeArgument1Case1, 3), 3, "third-smallest")
    let treeArgument1Case2 = makeTree([3, 1, 4, nil, 2])
    expectEqual(Solution().kthSmallest(treeArgument1Case2, 1), 1, "first-smallest")
    let treeArgument1Case3 = makeTree([1])
    expectEqual(Solution().kthSmallest(treeArgument1Case3, 1), 1, "single-node")
    // EXCLUDED_VECTOR zero-rank: [[2,1,3],0] | The rank starts at one.
    // EXCLUDED_VECTOR rank-too-large: [[2,1,3],4] | The rank cannot exceed the node count.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
