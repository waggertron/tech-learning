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
    func canPartition(_ nums: [Int]) -> Bool { let sum = nums.reduce(0, +); if sum % 2 == 1 { return false }; let target = sum / 2; var memo: [String: Bool] = [:]; func solve(_ i: Int, _ remaining: Int) -> Bool { if remaining == 0 { return true }; if i == nums.count || remaining < 0 { return false }; let key = "\(i):\(remaining)"; if let v = memo[key] { return v }; let v = solve(i + 1, remaining) || solve(i + 1, remaining - nums[i]); memo[key] = v; return v }; return solve(0, target) }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:549a768aeb46e811fc6e29139a3bb4669bdd81b27bce75a1d58fd75ebc4a9f8f
    expectEqual(Solution().canPartition([1, 5, 11, 5]), true, "partitionable")
    expectEqual(Solution().canPartition([1, 2, 3, 5]), false, "not-partitionable")
    expectEqual(Solution().canPartition([2, 2, 1, 1]), true, "duplicates")
    expectEqual(Solution().canPartition([1]), false, "single-value")
    // EXCLUDED_VECTOR empty-array: [[]] | The published input contains at least one value.
    // EXCLUDED_VECTOR zero-value: [[0,1]] | Published values are positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
