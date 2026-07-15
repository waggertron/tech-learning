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
    func maxAreaOfIsland(_ grid: [[Int]]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:677de97f3bc4766e7dbc445486e59fe5854eccf50748f69c80a72042749389cc
    expectEqual(Solution().maxAreaOfIsland([[0, 0, 1], [1, 1, 1], [0, 1, 0]]), 5, "five-cell-island")
    expectEqual(Solution().maxAreaOfIsland([[1, 0, 1], [0, 0, 0], [1, 1, 0]]), 2, "separate-islands")
    expectEqual(Solution().maxAreaOfIsland([[0]]), 0, "single-water-cell")
    // EXCLUDED_VECTOR ragged-grid: [[[1,0],[1]]] | The problem contract requires a rectangular grid.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
