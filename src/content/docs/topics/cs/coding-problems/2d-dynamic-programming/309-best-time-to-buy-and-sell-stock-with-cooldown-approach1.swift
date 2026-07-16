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
    func maxProfit(_ prices: [Int]) -> Int {
        func solve(_ day: Int, _ holding: Bool) -> Int { if day >= prices.count { return 0 }; if holding { return max(solve(day + 1, true), prices[day] + solve(day + 2, false)) }; return max(solve(day + 1, false), -prices[day] + solve(day + 1, true)) }
        return solve(0, false)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:528543555f84e8b729aaf474658fa7965eb32f694ae81971c3283e5752e9d87f
    expectEqual(Solution().maxProfit([1, 2, 3, 0, 2]), 3, "cooldown-example")
    expectEqual(Solution().maxProfit([2, 1, 4]), 3, "rising-after-drop")
    expectEqual(Solution().maxProfit([1, 2]), 1, "two-days")
    expectEqual(Solution().maxProfit([3, 2, 1]), 0, "declining")
    expectEqual(Solution().maxProfit([5]), 0, "single-price")
    // EXCLUDED_VECTOR empty-prices: [[]] | At least one price is provided.
    // EXCLUDED_VECTOR negative-price: [[-1,2]] | Prices are nonnegative integers.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
