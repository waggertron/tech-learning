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
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:38cbcd473bfaa32908776a8897b76271660740b3abcc1d0586df396a07670d38
    expectEqual(Solution().maxProfit([7, 1, 5, 3, 6, 4]), 7, "multiple-climbs")
    expectEqual(Solution().maxProfit([7, 6, 4, 3, 1]), 0, "falling-market")
    expectEqual(Solution().maxProfit([5]), 0, "single-price")
    // EXCLUDED_VECTOR negative-price: [[3,-1]] | Stock prices must be nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
