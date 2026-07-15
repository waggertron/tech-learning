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
    func missingNumber(_ nums: [Int]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:2e382c404c79fcf2f6104795a6bb29e2178ac22a5ecc75ffa3b330933bab2d92
    expectEqual(Solution().missingNumber([3, 0, 1]), 2, "missing-middle")
    expectEqual(Solution().missingNumber([0, 1]), 2, "missing-last")
    expectEqual(Solution().missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]), 8, "larger-unordered-input")
    expectEqual(Solution().missingNumber([1]), 0, "missing-zero")
    expectEqual(Solution().missingNumber([0]), 1, "missing-one")
    expectEqual(Solution().missingNumber([0, 1, 2, 3, 4]), 5, "ordered-input")
    // EXCLUDED_VECTOR empty-array: [[]] | The input contract requires at least one array element.
    // EXCLUDED_VECTOR duplicate-value: [[0,1,1]] | Every supplied value must be unique.
    // EXCLUDED_VECTOR value-outside-range: [[0,1,4]] | For an array of length n, every value must be in the inclusive range from 0 through n.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
