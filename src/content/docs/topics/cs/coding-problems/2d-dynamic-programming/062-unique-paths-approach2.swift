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
    func uniquePaths(_ m: Int, _ n: Int) -> Int {
        var dp = Array(repeating: Array(repeating: 1, count: n), count: m)
        if m > 1 && n > 1 {
            for row in stride(from: m - 2, through: 0, by: -1) {
                for col in stride(from: n - 2, through: 0, by: -1) { dp[row][col] = dp[row + 1][col] + dp[row][col + 1] }
            }
        }
        return dp[0][0]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:57bf1ec18a88a3304104b240b894db759ecea76b10b72b3856e0c4ce3b44d7f6
    expectEqual(Solution().uniquePaths(3, 7), 28, "three-by-seven")
    expectEqual(Solution().uniquePaths(3, 2), 3, "three-by-two")
    expectEqual(Solution().uniquePaths(1, 5), 1, "single-row")
    expectEqual(Solution().uniquePaths(4, 1), 1, "single-column")
    expectEqual(Solution().uniquePaths(1, 1), 1, "single-cell")
    // EXCLUDED_VECTOR zero-rows: [0,3] | Grid dimensions are positive.
    // EXCLUDED_VECTOR negative-column: [3,-1] | Grid dimensions are positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
