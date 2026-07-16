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
    func maxProfit(_ prices: [Int], _ fee: Int) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:a69f10fa9f4532ecdd064f7076da8b75d2b4eccdfd67cacd433943c0df55a7b9
    expectEqual(Solution().maxProfit([1, 3, 2, 8, 4, 9], 2), 8, "standard")
    expectEqual(Solution().maxProfit([1, 3, 7, 5, 10, 3], 3), 6, "second-example")
    expectEqual(Solution().maxProfit([1, 2], 0), 1, "zero-fee")
    expectEqual(Solution().maxProfit([5, 4, 3], 1), 0, "declining")
    expectEqual(Solution().maxProfit([1], 2), 0, "single-price")
    // EXCLUDED_VECTOR empty-prices: [[],2] | At least one price is provided.
    // EXCLUDED_VECTOR negative-fee: [[1,2],-1] | The transaction fee is nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
