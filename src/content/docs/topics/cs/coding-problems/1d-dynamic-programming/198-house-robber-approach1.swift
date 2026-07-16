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
    func rob(_ nums: [Int]) -> Int { func solve(_ i: Int) -> Int { i >= nums.count ? 0 : max(solve(i + 1), nums[i] + solve(i + 2)) }; return solve(0) }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:938db9a8beee78993dcdfbf4e9c1d1ca7571a92e5686f86a2193e861b8598073
    expectEqual(Solution().rob([1, 2, 3, 1]), 4, "alternating")
    expectEqual(Solution().rob([2, 7, 9, 3, 1]), 12, "larger-example")
    expectEqual(Solution().rob([0, 0, 0]), 0, "all-zero")
    expectEqual(Solution().rob([5]), 5, "single-house")
    // EXCLUDED_VECTOR empty-array: [[]] | The published street contains at least one house.
    // EXCLUDED_VECTOR negative-money: [[1,-1]] | House values are nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
