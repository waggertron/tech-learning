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
    func longestCommonSubsequence(_ text1: String, _ text2: String) -> Int {
        let a = Array(text1), b = Array(text2); var dp = Array(repeating: Array(repeating: 0, count: b.count + 1), count: a.count + 1)
        if !a.isEmpty && !b.isEmpty { for i in stride(from: a.count - 1, through: 0, by: -1) { for j in stride(from: b.count - 1, through: 0, by: -1) { dp[i][j] = a[i] == b[j] ? 1 + dp[i + 1][j + 1] : max(dp[i + 1][j], dp[i][j + 1]) } } }
        return dp[0][0]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:01e3a9dd7c487f99c5d54d43ade296d45d363ede1c2852400eb103357f6b95f0
    expectEqual(Solution().longestCommonSubsequence("abcde", "ace"), 3, "shared-subsequence")
    expectEqual(Solution().longestCommonSubsequence("abc", "abc"), 3, "identical")
    expectEqual(Solution().longestCommonSubsequence("abc", "def"), 0, "disjoint")
    expectEqual(Solution().longestCommonSubsequence("", "abc"), 0, "empty-first")
    expectEqual(Solution().longestCommonSubsequence("", ""), 0, "both-empty")
    // EXCLUDED_VECTOR uppercase: ["ABC","abc"] | Published inputs use lowercase English letters.
    // EXCLUDED_VECTOR digit: ["a1","a"] | Published inputs use lowercase English letters.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
