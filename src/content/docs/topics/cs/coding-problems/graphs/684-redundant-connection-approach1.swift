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
        for removed in edges.indices.reversed() {
            var graph = Array(repeating: [Int](), count: n + 1)
            for index in edges.indices where index != removed {
                let edge = edges[index]; graph[edge[0]].append(edge[1]); graph[edge[1]].append(edge[0])
            }
            var seen = Set<Int>(), stack = [1]
            while let node = stack.popLast() { if seen.insert(node).inserted { stack.append(contentsOf: graph[node]) } }
            if seen.count == n { return edges[removed] }
        }
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
