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
    func maxCoins(_ nums: [Int]) -> Int {
        let values = [1] + nums + [1], n = nums.count; var dp = Array(repeating: Array(repeating: 0, count: n + 2), count: n + 2)
        if n > 0 { for length in 1...n { for left in 1...(n - length + 1) { let right = left + length - 1; for last in left...right { dp[left][right] = max(dp[left][right], values[left - 1] * values[last] * values[right + 1] + dp[left][last - 1] + dp[last + 1][right]) } } } }
        return dp[1][n]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:7f7935f4cfa254b54337b22661e6b96d3afa482a2956b9699730ddcf72d0d8ed
    expectEqual(Solution().maxCoins([3, 1, 5, 8]), 167, "canonical")
    expectEqual(Solution().maxCoins([1, 5]), 10, "two-balloons")
    expectEqual(Solution().maxCoins([1, 1, 1]), 3, "three-ones")
    expectEqual(Solution().maxCoins([2, 4, 3]), 33, "mixed-small")
    expectEqual(Solution().maxCoins([7]), 7, "single-balloon")
    // EXCLUDED_VECTOR empty-balloons: [[]] | At least one balloon is provided.
    // EXCLUDED_VECTOR zero-value: [[1,0,2]] | Balloon values are positive integers.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
