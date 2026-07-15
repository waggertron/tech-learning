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
    func findPeakElement(_ nums: [Int]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:9cea99660cc25df19d165144a076beb7910c1b0838d6489b61fdf49ee8d7a218
    expectEqual(Solution().findPeakElement([1, 2, 3, 1]), 2, "interior-peak")
    expectEqual(Solution().findPeakElement([1, 3, 2]), 1, "short-interior-peak")
    expectEqual(Solution().findPeakElement([7]), 0, "single-element")
    expectEqual(Solution().findPeakElement([3, 2, 1]), 0, "strictly-decreasing")
    expectEqual(Solution().findPeakElement([1, 2, 3]), 2, "strictly-increasing")
    // EXCLUDED_VECTOR empty-array: [[]] | The problem contract requires at least one array element.
    // EXCLUDED_VECTOR equal-adjacent-values: [[1,1]] | Adjacent values must be different.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
