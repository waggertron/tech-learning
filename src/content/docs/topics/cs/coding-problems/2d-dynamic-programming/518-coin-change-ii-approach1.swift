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
    func change(_ amount: Int, _ coins: [Int]) -> Int {
        func solve(_ index: Int, _ remaining: Int) -> Int { if remaining == 0 { return 1 }; if index == coins.count || remaining < 0 { return 0 }; return solve(index, remaining - coins[index]) + solve(index + 1, remaining) }
        return solve(0, amount)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:11c4de8cd20551dde31831792fd0d09ce97ef5f925e855d7497f89914b9bf36a
    expectEqual(Solution().change(5, [1, 2, 5]), 4, "standard")
    expectEqual(Solution().change(3, [2]), 0, "impossible")
    expectEqual(Solution().change(10, [10]), 1, "single-coin")
    expectEqual(Solution().change(4, [1, 2, 3]), 4, "multiple-combinations")
    expectEqual(Solution().change(0, [1, 2]), 1, "zero-amount")
    // EXCLUDED_VECTOR negative-amount: [-1,[1]] | The amount is nonnegative.
    // EXCLUDED_VECTOR zero-coin: [3,[0,1]] | Coin denominations are positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
