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
    func repeatedSubstringPattern(_ s: String) -> Bool {
        guard s.count > 1 else { return false }; let doubled = s + s; return doubled.dropFirst().dropLast().contains(s)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cd8cde30f9f3f29278e2f5c6df1cd173ad434de2271cbd60cdd5bb6c2c7947c1
    expectEqual(Solution().repeatedSubstringPattern("abab"), true, "repeat-two")
    expectEqual(Solution().repeatedSubstringPattern("aba"), false, "not-repeat")
    expectEqual(Solution().repeatedSubstringPattern("abcabcabcabc"), true, "repeat-four")
    expectEqual(Solution().repeatedSubstringPattern("a"), false, "single")
    expectEqual(Solution().repeatedSubstringPattern("aa"), true, "same-char")
    expectEqual(Solution().repeatedSubstringPattern("abaaba"), true, "repeat-three")
    // EXCLUDED_VECTOR empty: [""] | The input contains at least one lowercase letter.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
