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
final class Solution {
    func validTree(_ n: Int, _ edges: [[Int]]) -> Bool {
        guard edges.count == n - 1 else { return false }
        var graph = Array(repeating: [Int](), count: n)
        for edge in edges { graph[edge[0]].append(edge[1]); graph[edge[1]].append(edge[0]) }
        var seen = Set<Int>()
        func visit(_ node: Int, _ parent: Int) -> Bool {
            if seen.contains(node) { return false }
            seen.insert(node)
            for next in graph[node] where next != parent && !visit(next, node) { return false }
            return true
        }
        return visit(0, -1) && seen.count == n
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:6b986e4db333a5f55da7925a3abe0423c72fd601604d758fb32f85c8d7f54b71
    expectEqual(Solution().validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]), true, "connected-tree")
    expectEqual(Solution().validTree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]), false, "contains-cycle")
    expectEqual(Solution().validTree(1, []), true, "single-node")
    // EXCLUDED_VECTOR vertex-out-of-range: [2,[[0,2]]] | Every endpoint must be in the range zero through n minus one.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
