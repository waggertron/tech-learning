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
    func countComponents(_ n: Int, _ edges: [[Int]]) -> Int {
        var graph = Array(repeating: [Int](), count: n)
        for edge in edges { graph[edge[0]].append(edge[1]); graph[edge[1]].append(edge[0]) }
        var seen = Set<Int>(), components = 0
        func visit(_ node: Int) {
            if !seen.insert(node).inserted { return }
            for next in graph[node] { visit(next) }
        }
        for node in 0..<n where !seen.contains(node) { components += 1; visit(node) }
        return components
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:4052dea7953b371c8e6db83e3ea9c5b9e3d1a6dca9e9aba06d05ac35c4ee2896
    expectEqual(Solution().countComponents(5, [[0, 1], [1, 2], [3, 4]]), 2, "two-components")
    expectEqual(Solution().countComponents(4, [[0, 1], [1, 2], [2, 3]]), 1, "all-connected")
    expectEqual(Solution().countComponents(1, []), 1, "single-node")
    // EXCLUDED_VECTOR vertex-out-of-range: [2,[[0,2]]] | Every endpoint must be in the range zero through n minus one.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
