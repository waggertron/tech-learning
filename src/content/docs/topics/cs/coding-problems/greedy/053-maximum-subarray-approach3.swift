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
    func maxSubArray(_ nums: [Int]) -> Int {
        var current = nums[0], best = nums[0]
        for value in nums.dropFirst() { current = max(value, current + value); best = max(best, current) }
        return best
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d2ab82590b7baab06942a7149eff50c0cf09dbf3bc887ef6d0143f438c62030a
    expectEqual(Solution().maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6, "mixed-values")
    expectEqual(Solution().maxSubArray([-3, -2, -5]), -2, "all-negative")
    expectEqual(Solution().maxSubArray([5]), 5, "single-value")
    // EXCLUDED_VECTOR empty-array: [[]] | The problem contract requires at least one number.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
