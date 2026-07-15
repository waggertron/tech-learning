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
    func singleNumber(_ nums: [Int]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c1725e5533b40d1d34ad6b6bc16e9e9c65b7a1d1103cce8733e90133df623b7b
    expectEqual(Solution().singleNumber([2, 2, 1]), 1, "single-at-end")
    expectEqual(Solution().singleNumber([4, 1, 2, 1, 2]), 4, "single-among-pairs")
    expectEqual(Solution().singleNumber([-1, -1, 42]), 42, "negative-pair")
    expectEqual(Solution().singleNumber([0, 0, 99]), 99, "zero-pair")
    expectEqual(Solution().singleNumber([7]), 7, "one-element")
    expectEqual(Solution().singleNumber([-2147483648, 5, 5, 2147483647, 2147483647]), -2147483648, "signed-extremes")
    // EXCLUDED_VECTOR empty-array: [[]] | The input contract requires at least one element.
    // EXCLUDED_VECTOR two-single-values: [[1,2,3,3]] | Exactly one value must appear once and every other value must appear twice.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
