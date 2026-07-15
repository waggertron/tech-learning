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
    func isBipartite(_ graph: [[Int]]) -> Bool {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:db00f4c4747db0bf315f05cab58fa94d304b161b3e5c8ed53eaf7de7122f7c78
    expectEqual(Solution().isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]]), true, "even-cycle")
    expectEqual(Solution().isBipartite([[1, 2], [0, 2], [0, 1]]), false, "odd-cycle")
    expectEqual(Solution().isBipartite([[]]), true, "single-vertex")
    // EXCLUDED_VECTOR neighbor-out-of-range: [[[1]]] | Every neighbor index must name a vertex in the graph.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
