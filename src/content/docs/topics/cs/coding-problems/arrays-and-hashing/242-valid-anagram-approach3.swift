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
    func isAnagram(_ s: String, _ t: String) -> Bool {
        guard s.utf8.count == t.utf8.count else { return false }; var counts = Array(repeating: 0, count: 26)
        for byte in s.utf8 { counts[Int(byte - 97)] += 1 }; for byte in t.utf8 { counts[Int(byte - 97)] -= 1 }
        return counts.allSatisfy { $0 == 0 }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:9c09c02251dfef0867a9d8ad9bc785ef62dc1b2c4f6954d7ccd604dc8dda02fc
    expectEqual(Solution().isAnagram("anagram", "nagaram"), true, "canonical")
    expectEqual(Solution().isAnagram("rat", "car"), false, "different")
    expectEqual(Solution().isAnagram("a", "a"), true, "same")
    expectEqual(Solution().isAnagram("ab", "ba"), true, "reordered")
    expectEqual(Solution().isAnagram("ab", "a"), false, "different-length")
    expectEqual(Solution().isAnagram("", ""), true, "empty")
    // EXCLUDED_VECTOR uppercase: ["A","A"] | The original problem limits input to lowercase English letters.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
