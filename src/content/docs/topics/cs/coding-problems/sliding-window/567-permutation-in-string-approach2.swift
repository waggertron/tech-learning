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
    func checkInclusion(_ s1: String, _ s2: String) -> Bool {
        let pattern = Array(s1), text = Array(s2)
        guard pattern.count <= text.count else { return false }
        let required = frequencies(pattern)
        for start in 0...(text.count - pattern.count) {
            if frequencies(Array(text[start..<(start + pattern.count)])) == required { return true }
        }
        return false
    }

    private func frequencies(_ values: [Character]) -> [Character: Int] {
        values.reduce(into: [:]) { $0[$1, default: 0] += 1 }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:625e867f4583523bc5a748d2186d7f4ce74a6b637784e7b49acfdc1e95ed670c
    expectEqual(Solution().checkInclusion("ab", "eidbaooo"), true, "permutation-present")
    expectEqual(Solution().checkInclusion("ab", "eidboaoo"), false, "permutation-missing")
    expectEqual(Solution().checkInclusion("adc", "dcda"), true, "overlapping-window")
    expectEqual(Solution().checkInclusion("aabc", "caaebcaab"), true, "repeated-characters")
    expectEqual(Solution().checkInclusion("a", "a"), true, "single-character")
    expectEqual(Solution().checkInclusion("abcd", "abc"), false, "pattern-longer-than-text")
    // EXCLUDED_VECTOR empty-pattern: ["","abc"] | The pattern must contain at least one lowercase letter.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
