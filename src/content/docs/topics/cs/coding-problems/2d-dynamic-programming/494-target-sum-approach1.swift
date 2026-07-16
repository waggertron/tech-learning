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
    func findTargetSumWays(_ nums: [Int], _ target: Int) -> Int {
        func solve(_ index: Int, _ sum: Int) -> Int { if index == nums.count { return sum == target ? 1 : 0 }; return solve(index + 1, sum + nums[index]) + solve(index + 1, sum - nums[index]) }
        return solve(0, 0)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:6e8fadb03dadcd22f574554f203c8f07b294dfebf8d11187f2ad95dd676aeae7
    expectEqual(Solution().findTargetSumWays([1, 1, 1, 1, 1], 3), 5, "five-ones")
    expectEqual(Solution().findTargetSumWays([1], 1), 1, "single-match")
    expectEqual(Solution().findTargetSumWays([1], 2), 0, "unreachable")
    expectEqual(Solution().findTargetSumWays([0, 0, 0, 0, 0], 0), 32, "five-zeroes")
    expectEqual(Solution().findTargetSumWays([0], 0), 2, "single-zero")
    // EXCLUDED_VECTOR empty-numbers: [[],0] | At least one number is provided.
    // EXCLUDED_VECTOR negative-number: [[-1,1],0] | Published numbers are nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
