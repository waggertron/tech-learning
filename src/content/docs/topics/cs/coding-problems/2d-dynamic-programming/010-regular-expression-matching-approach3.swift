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
    func isMatch(_ s: String, _ p: String) -> Bool {
        let text = Array(s), pattern = Array(p)
        var dp = Array(repeating: Array(repeating: false, count: pattern.count + 1), count: text.count + 1)
        dp[text.count][pattern.count] = true
        for i in stride(from: text.count, through: 0, by: -1) {
            if pattern.isEmpty { continue }
            for j in stride(from: pattern.count - 1, through: 0, by: -1) {
                let first = i < text.count && (pattern[j] == "." || pattern[j] == text[i])
                if j + 1 < pattern.count && pattern[j + 1] == "*" {
                    dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j])
                } else if first {
                    dp[i][j] = dp[i + 1][j + 1]
                }
            }
        }
        return dp[0][0]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:176b5a2418880bb188423d026e8b14357e0d200a10266c9b8da238d33a9adbb8
    expectEqual(Solution().isMatch("aa", "a"), false, "literal-mismatch")
    expectEqual(Solution().isMatch("aa", "a*"), true, "star-repeat")
    expectEqual(Solution().isMatch("ab", ".*"), true, "wildcard-star")
    expectEqual(Solution().isMatch("mississippi", "mis*is*p*."), false, "complex-miss")
    expectEqual(Solution().isMatch("", ""), true, "both-empty")
    // EXCLUDED_VECTOR leading-star: ["a","*a"] | Patterns do not begin with an asterisk.
    // EXCLUDED_VECTOR double-star: ["a","a**"] | Each asterisk follows a valid atom exactly once.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
