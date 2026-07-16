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
    // TEST_VECTORS_BEGIN sha256:ead7e4961ee9ae86c58df07eda6caf4cb78472357cecfe7aad23054fcf8b2182
    expectEqual(Solution().maxProfit([7, 1, 5, 3, 6, 4]), 5, "buy-low-sell-high")
    expectEqual(Solution().maxProfit([7, 6, 4, 3, 1]), 0, "strictly-decreasing")
    expectEqual(Solution().maxProfit([2, 4, 1]), 2, "short-opportunity")
    expectEqual(Solution().maxProfit([3, 3, 3]), 0, "flat-prices")
    expectEqual(Solution().maxProfit([5]), 0, "single-day")
    // EXCLUDED_VECTOR empty-prices: [[]] | At least one daily price is required.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
