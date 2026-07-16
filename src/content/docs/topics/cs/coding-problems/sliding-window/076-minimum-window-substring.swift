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
    func minWindow(_ s: String, _ t: String) -> String {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:5253d46c8dc7e7e6537b126c7c84d1534f9ea4284ebcd0d20fe9ad1b4153913a
    expectEqual(Solution().minWindow("ADOBECODEBANC", "ABC"), "BANC", "canonical-window")
    expectEqual(Solution().minWindow("a", "a"), "a", "exact-single-character")
    expectEqual(Solution().minWindow("a", "aa"), "", "insufficient-frequency")
    expectEqual(Solution().minWindow("aa", "aa"), "aa", "whole-string-window")
    expectEqual(Solution().minWindow("a", "b"), "", "target-not-present")
    // EXCLUDED_VECTOR empty-target: ["abc",""] | The target must contain at least one character.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
