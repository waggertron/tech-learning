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
    func criticalConnections(_ n: Int, _ connections: [[Int]]) -> [[Int]] {
        var graph = Array(repeating: [Int](), count: n)
        for edge in connections { graph[edge[0]].append(edge[1]); graph[edge[1]].append(edge[0]) }
        var discovery = Array(repeating: -1, count: n), low = Array(repeating: 0, count: n), time = 0, bridges: [[Int]] = []
        func dfs(_ node: Int, _ parent: Int) {
            discovery[node] = time; low[node] = time; time += 1
            for neighbor in graph[node] where neighbor != parent {
                if discovery[neighbor] == -1 {
                    dfs(neighbor, node); low[node] = min(low[node], low[neighbor])
                    if low[neighbor] > discovery[node] { bridges.append([min(node, neighbor), max(node, neighbor)]) }
                } else { low[node] = min(low[node], discovery[neighbor]) }
            }
        }
        dfs(0, -1)
        bridges.sort { $0[0] == $1[0] ? $0[1] < $1[1] : $0[0] < $1[0] }
        return bridges
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:849b8447dd7d489efe38e857ba42e1b449de8f103d2c167d46fcb9be07230d73
    expectEqual(Solution().criticalConnections(4, [[0, 1], [1, 2], [2, 0], [1, 3]]), [[1, 3]], "one-bridge")
    expectEqual(Solution().criticalConnections(4, [[0, 1], [1, 2], [2, 3]]), [[0, 1], [1, 2], [2, 3]], "chain")
    expectEqual(Solution().criticalConnections(3, [[0, 1], [1, 2], [2, 0]]), [], "cycle")
    expectEqual(Solution().criticalConnections(6, [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3]]), [[2, 3]], "cycles-with-bridge")
    expectEqual(Solution().criticalConnections(2, [[0, 1]]), [[0, 1]], "two-nodes")
    // EXCLUDED_VECTOR zero-nodes: [0,[]] | The graph contains at least two nodes.
    // EXCLUDED_VECTOR disconnected: [4,[[0,1],[2,3]]] | The published graph is connected.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
