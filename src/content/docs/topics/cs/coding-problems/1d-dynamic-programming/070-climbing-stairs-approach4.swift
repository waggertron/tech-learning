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
    func climbStairs(_ n: Int) -> Int { if n <= 2 { return n }; var first = 1, second = 2; for _ in 3...n { (first, second) = (second, first + second) }; return second }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:6c0d17c1471a9f8717e168eb2ae237eb74b81b88e95b372da6f8ace7802f79c7
    expectEqual(Solution().climbStairs(2), 2, "two-steps")
    expectEqual(Solution().climbStairs(3), 3, "three-steps")
    expectEqual(Solution().climbStairs(5), 8, "five-steps")
    expectEqual(Solution().climbStairs(1), 1, "one-step")
    // EXCLUDED_VECTOR zero-steps: [0] | The published range starts at one step.
    // EXCLUDED_VECTOR negative-steps: [-1] | The step count must be positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
