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
    func longestPalindrome(_ s: String) -> String { let c = Array(s); var best = (0, 0); func expand(_ a: Int, _ b: Int) -> (Int, Int) { var l = a, r = b; while l >= 0 && r < c.count && c[l] == c[r] { l -= 1; r += 1 }; return (l + 1, r - l - 1) }; for i in c.indices { for pair in [expand(i, i), expand(i, i + 1)] where pair.1 > best.1 { best = pair } }; return String(c[best.0..<(best.0 + best.1)]) }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:debc0232406a301591902a5994d89286ecb33d8e9924601ab80f054519a63930
    expectEqual(Solution().longestPalindrome("babad"), "bab", "odd-palindrome")
    expectEqual(Solution().longestPalindrome("cbbd"), "bb", "even-palindrome")
    expectEqual(Solution().longestPalindrome("forgeeksskeegfor"), "geeksskeeg", "long-center")
    expectEqual(Solution().longestPalindrome("a"), "a", "single-character")
    expectEqual(Solution().longestPalindrome("ac"), "a", "two-characters")
    // EXCLUDED_VECTOR empty-string: [""] | The published input contains at least one character.
    // EXCLUDED_VECTOR non-ascii: ["été"] | The runnable contract uses the published ASCII alphabet.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
