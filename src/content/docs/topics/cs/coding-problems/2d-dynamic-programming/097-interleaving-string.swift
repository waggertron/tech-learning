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
    func isInterleave(_ s1: String, _ s2: String, _ s3: String) -> Bool {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:349fbb984ce96e33d2b29e9b9065ee70968dbb5540e5f4b1242a5c6f1b79d4e1
    expectEqual(Solution().isInterleave("aabcc", "dbbca", "aadbbcbcac"), true, "valid-weave")
    expectEqual(Solution().isInterleave("aabcc", "dbbca", "aadbbbaccc"), false, "invalid-weave")
    expectEqual(Solution().isInterleave("", "abc", "abc"), true, "empty-first")
    expectEqual(Solution().isInterleave("a", "b", "a"), false, "length-mismatch")
    expectEqual(Solution().isInterleave("", "", ""), true, "all-empty")
    // EXCLUDED_VECTOR uppercase: ["A","b","Ab"] | Published inputs use lowercase English letters.
    // EXCLUDED_VECTOR digit: ["a","1","a1"] | Published inputs use lowercase English letters.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
