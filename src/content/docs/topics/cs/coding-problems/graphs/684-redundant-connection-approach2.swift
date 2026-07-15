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
    func findRedundantConnection(_ edges: [[Int]]) -> [Int] {
        let n = edges.count
        var graph = Array(repeating: [Int](), count: n + 1)
        for edge in edges { graph[edge[0]].append(edge[1]); graph[edge[1]].append(edge[0]) }
        func connected(_ start: Int, _ target: Int, _ skipped: [Int]) -> Bool {
            var seen = Set<Int>(), stack = [start]
            while let node = stack.popLast() {
                if node == target { return true }
                if seen.insert(node).inserted {
                    for next in graph[node] where !((node == skipped[0] && next == skipped[1]) || (node == skipped[1] && next == skipped[0])) { stack.append(next) }
                }
            }
            return false
        }
        for edge in edges.reversed() where connected(edge[0], edge[1], edge) { return edge }
        return []
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:bd7e536e3b4c6bfc16abca2429a792ce04a8ebfba1a5882e3d2b106111716b5e
    expectEqual(Solution().findRedundantConnection([[1, 2], [1, 3], [2, 3]]), [2, 3], "triangle-cycle")
    expectEqual(Solution().findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]), [1, 4], "late-cycle-edge")
    expectEqual(Solution().findRedundantConnection([[1, 2], [2, 3], [1, 3]]), [1, 3], "smallest-cycle")
    // EXCLUDED_VECTOR disconnected-input: [[[1,2],[3,4],[1,2]]] | The problem contract starts from one connected tree plus one edge.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
