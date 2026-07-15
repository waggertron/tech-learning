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
    func shortestPathBinaryMatrix(_ grid: [[Int]]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3d87ba407d5e5c0de661a8c7a1747e5cb1e2400480d43125bd43b517652d5433
    expectEqual(Solution().shortestPathBinaryMatrix([[0, 1], [1, 0]]), 2, "diagonal-path")
    expectEqual(Solution().shortestPathBinaryMatrix([[0, 0, 0], [1, 1, 0], [1, 1, 0]]), 4, "winding-path")
    expectEqual(Solution().shortestPathBinaryMatrix([[0]]), 1, "single-open-cell")
    // EXCLUDED_VECTOR ragged-grid: [[[0,0],[0]]] | The problem contract requires a square matrix.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
