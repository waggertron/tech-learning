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
    func rob(_ nums: [Int]) -> Int { if nums.count == 1 { return nums[0] }; func line(_ values: ArraySlice<Int>) -> Int { var a = 0, b = 0; for value in values { (a, b) = (b, max(b, a + value)) }; return b }; return max(line(nums.dropLast()), line(nums.dropFirst())) }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:29f04ffe631694a0075426799ac5dbc76c445004a8be5c6cc9fa62891a736815
    expectEqual(Solution().rob([2, 3, 2]), 3, "three-houses")
    expectEqual(Solution().rob([1, 2, 3, 1]), 4, "four-houses")
    expectEqual(Solution().rob([1, 2, 3]), 3, "choose-last")
    expectEqual(Solution().rob([1]), 1, "single-house")
    // EXCLUDED_VECTOR empty-array: [[]] | The published circle contains at least one house.
    // EXCLUDED_VECTOR negative-money: [[1,-1]] | House values are nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
