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
    func minDistance(_ word1: String, _ word2: String) -> Int {
        let a = Array(word1), b = Array(word2)
        var dp = Array(repeating: Array(repeating: 0, count: b.count + 1), count: a.count + 1)
        for i in 0...a.count { dp[i][b.count] = a.count - i }
        for j in 0...b.count { dp[a.count][j] = b.count - j }
        if !a.isEmpty && !b.isEmpty {
            for i in stride(from: a.count - 1, through: 0, by: -1) {
                for j in stride(from: b.count - 1, through: 0, by: -1) { dp[i][j] = a[i] == b[j] ? dp[i + 1][j + 1] : 1 + min(dp[i + 1][j], dp[i][j + 1], dp[i + 1][j + 1]) }
            }
        }
        return dp[0][0]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:34b7b6cc8f6071a677c43e0342dcca03bc2e133d10b78b2de80f8ad4622a945b
    expectEqual(Solution().minDistance("horse", "ros"), 3, "horse-ros")
    expectEqual(Solution().minDistance("intention", "execution"), 5, "intention-execution")
    expectEqual(Solution().minDistance("abc", "abc"), 0, "same-word")
    expectEqual(Solution().minDistance("", "abc"), 3, "empty-source")
    expectEqual(Solution().minDistance("", ""), 0, "both-empty")
    // EXCLUDED_VECTOR uppercase: ["ABC","abc"] | Published inputs use lowercase English letters.
    // EXCLUDED_VECTOR non-letter: ["a1","a"] | Published inputs use lowercase English letters.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
