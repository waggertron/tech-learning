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
    func increasingTriplet(_ nums: [Int]) -> Bool {
        if nums.count < 3 { return false }
        var prefix = nums, suffix = nums
        for index in 1..<nums.count { prefix[index] = min(prefix[index - 1], nums[index]) }
        for index in stride(from: nums.count - 2, through: 0, by: -1) { suffix[index] = max(suffix[index + 1], nums[index]) }
        return (1..<(nums.count - 1)).contains { prefix[$0 - 1] < nums[$0] && nums[$0] < suffix[$0 + 1] }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3200cbd76b7656dcd6193e65e6ce5e22cfabfe86cb32c6872ac36b13742e5eda
    expectEqual(Solution().increasingTriplet([2, 1, 5, 0, 4, 6]), true, "triplet-after-reset")
    expectEqual(Solution().increasingTriplet([5, 4, 3, 2, 1]), false, "strictly-decreasing")
    expectEqual(Solution().increasingTriplet([1, 2]), false, "two-values")
    // EXCLUDED_VECTOR empty-array: [[]] | The problem contract requires at least one number.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
