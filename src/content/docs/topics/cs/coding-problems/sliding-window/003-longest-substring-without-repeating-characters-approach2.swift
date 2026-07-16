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
    func lengthOfLongestSubstring(_ s: String) -> Int {
        let characters = Array(s)
        var seen: Set<Character> = []
        var left = 0, best = 0
        for right in characters.indices {
            while seen.contains(characters[right]) {
                seen.remove(characters[left])
                left += 1
            }
            seen.insert(characters[right])
            best = max(best, right - left + 1)
        }
        return best
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:97e609ae3b63079acb1f6c70b45fafd1afe1d4c620eae9e3c5a63d1f85c52a70
    expectEqual(Solution().lengthOfLongestSubstring("abcabcbb"), 3, "repeating-block")
    expectEqual(Solution().lengthOfLongestSubstring("bbbbb"), 1, "single-repeated-character")
    expectEqual(Solution().lengthOfLongestSubstring("pwwkew"), 3, "overlapping-repeat")
    expectEqual(Solution().lengthOfLongestSubstring("abba"), 2, "left-edge-must-jump")
    expectEqual(Solution().lengthOfLongestSubstring(""), 0, "empty-string")
    expectEqual(Solution().lengthOfLongestSubstring("x"), 1, "single-character")
    // EXCLUDED_VECTOR non-ascii-character: ["a🐉b"] | The published input alphabet is ASCII letters, digits, symbols, and spaces.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
