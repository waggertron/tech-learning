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
    func coinChange(_ coins: [Int], _ amount: Int) -> Int { var dp = Array(repeating: amount + 1, count: amount + 1); dp[0] = 0; if amount > 0 { for value in 1...amount { for coin in coins where coin <= value { dp[value] = min(dp[value], dp[value - coin] + 1) } } }; return dp[amount] > amount ? -1 : dp[amount] }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:ed2c0613ff446bb1f8650a083165e5627f0a9d977338f4110ca34d37ce5a02c1
    expectEqual(Solution().coinChange([1, 2, 5], 11), 3, "canonical")
    expectEqual(Solution().coinChange([2], 3), -1, "impossible")
    expectEqual(Solution().coinChange([2, 5, 10, 1], 27), 4, "mixed-coins")
    expectEqual(Solution().coinChange([1], 0), 0, "zero-amount")
    // EXCLUDED_VECTOR empty-coins: [[],3] | At least one coin denomination is required.
    // EXCLUDED_VECTOR zero-coin: [[0,1],2] | Coin denominations must be positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
