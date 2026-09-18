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
    func findSubstring(_ s: String, _ words: [String]) -> [Int] {
        let text = Array(s)
        let wordLength = words[0].count
        let windowLength = wordLength * words.count
        let required = frequencies(words)
        guard windowLength <= text.count else { return [] }
        var answer: [Int] = []

        for start in 0...(text.count - windowLength) {
            var seen: [String: Int] = [:]
            for offset in stride(from: 0, to: windowLength, by: wordLength) {
                let word = String(text[(start + offset)..<(start + offset + wordLength)])
                seen[word, default: 0] += 1
            }
            if seen == required { answer.append(start) }
        }
        return answer
    }

    private func frequencies(_ words: [String]) -> [String: Int] {
        words.reduce(into: [:]) { $0[$1, default: 0] += 1 }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:4ed0b0ef6a0b4d4fb8b885ec9e435566d59c98b9fe89fa186c9196f08aa9ef0d
    expectEqual(Solution().findSubstring("barfoothefoobarman", ["foo", "bar"]), [0, 9], "canonical-two-words")
    expectEqual(Solution().findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "word"]), [], "missing-required-duplicate")
    expectEqual(Solution().findSubstring("barfoofoobarthefoobarman", ["bar", "foo", "the"]), [6, 9, 12], "three-overlapping-matches")
    expectEqual(Solution().findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "good"]), [8], "duplicate-word-required")
    expectEqual(Solution().findSubstring("aaaaaa", ["aa", "aa"]), [0, 1, 2], "overlapping-identical-words")
    expectEqual(Solution().findSubstring("foobar", ["foo", "bar"]), [0], "exact-whole-string")
    expectEqual(Solution().findSubstring("foo", ["foo", "bar"]), [], "text-shorter-than-concatenation")
    // EXCLUDED_VECTOR empty-word-list: ["foo",[]] | The word list must contain at least one word.
    // EXCLUDED_VECTOR unequal-word-lengths: ["foobar",["foo","ba"]] | Every word must have the same length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
