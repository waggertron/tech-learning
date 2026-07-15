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
    func canJump(_ nums: [Int]) -> Bool {
        var goal = nums.count - 1
        for index in stride(from: nums.count - 2, through: 0, by: -1) where index + nums[index] >= goal { goal = index }
        return goal == 0
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:5e0c867255e04e0f5571e925a3ce9ed07d0a7aa9d74b9a29e270f23e4c204223
    expectEqual(Solution().canJump([2, 3, 1, 1, 4]), true, "reachable-end")
    expectEqual(Solution().canJump([3, 2, 1, 0, 4]), false, "blocked-by-zero")
    expectEqual(Solution().canJump([0]), true, "single-zero")
    // EXCLUDED_VECTOR negative-jump: [[1,-1]] | Jump lengths must be nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
