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
    func minCostClimbingStairs(_ cost: [Int]) -> Int { var dp = Array(repeating: 0, count: cost.count + 1); if cost.count >= 2 { for i in 2...cost.count { dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]) } }; return dp[cost.count] }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:906cfef9287af44b1d578d0584c8513153efcd762939a85b276175da3005d0cc
    expectEqual(Solution().minCostClimbingStairs([10, 15, 20]), 15, "three-steps")
    expectEqual(Solution().minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]), 6, "long-example")
    expectEqual(Solution().minCostClimbingStairs([0, 0]), 0, "free-steps")
    // EXCLUDED_VECTOR too-short: [[5]] | The published staircase contains at least two steps.
    // EXCLUDED_VECTOR negative-cost: [[1,-1]] | Step costs are nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
