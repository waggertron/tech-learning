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
    func numDistinct(_ s: String, _ t: String) -> Int {
        let source = Array(s), target = Array(t); var dp = Array(repeating: 0, count: target.count + 1); dp[0] = 1
        for character in source { if !target.isEmpty { for j in stride(from: target.count, through: 1, by: -1) where character == target[j - 1] { dp[j] += dp[j - 1] } } }
        return dp[target.count]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:b52ea1d475aa012e676844982885b796ac2543f0c5aa4f51ef0905e594c44a4b
    expectEqual(Solution().numDistinct("rabbbit", "rabbit"), 3, "rabbbit-rabbit")
    expectEqual(Solution().numDistinct("babgbag", "bag"), 5, "babgbag-bag")
    expectEqual(Solution().numDistinct("abc", "abc"), 1, "same")
    expectEqual(Solution().numDistinct("abc", "abcd"), 0, "target-longer")
    expectEqual(Solution().numDistinct("abc", ""), 1, "empty-target")
    // EXCLUDED_VECTOR uppercase: ["ABC","A"] | Published inputs use English letters with documented case constraints.
    // EXCLUDED_VECTOR digit: ["a1","a"] | Published inputs contain letters only.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
