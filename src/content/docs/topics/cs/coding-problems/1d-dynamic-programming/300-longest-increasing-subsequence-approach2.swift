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
    func lengthOfLIS(_ nums: [Int]) -> Int { var dp = Array(repeating: 1, count: nums.count); for i in nums.indices { for j in 0..<i where nums[j] < nums[i] { dp[i] = max(dp[i], dp[j] + 1) } }; return dp.max() ?? 0 }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:5fd954005ac049dcb991aded8d04eed3542bbc12d50fca0f87f21531d4c5082a
    expectEqual(Solution().lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4, "classic")
    expectEqual(Solution().lengthOfLIS([0, 1, 0, 3, 2, 3]), 4, "mixed")
    expectEqual(Solution().lengthOfLIS([7, 7, 7]), 1, "duplicates")
    expectEqual(Solution().lengthOfLIS([1]), 1, "single-value")
    // EXCLUDED_VECTOR empty-array: [[]] | The published input contains at least one value.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
