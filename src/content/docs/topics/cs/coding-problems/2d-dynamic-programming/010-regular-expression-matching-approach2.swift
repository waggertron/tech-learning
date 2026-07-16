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
        var memo: [String: Bool] = [:]
        func solve(_ i: Int, _ j: Int) -> Bool {
            let key = "\(i):\(j)"
            if let cached = memo[key] { return cached }
            if j == pattern.count { return i == text.count }
            let first = i < text.count && (pattern[j] == "." || pattern[j] == text[i])
            let answer = j + 1 < pattern.count && pattern[j + 1] == "*"
                ? solve(i, j + 2) || (first && solve(i + 1, j))
                : first && solve(i + 1, j + 1)
            memo[key] = answer
            return answer
        }
        return solve(0, 0)
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
