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
    func strStr(_ haystack: String, _ needle: String) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:691040402b9a70b0fb7620e20dd03ce583b3ebec3f2696c90dc7b25f9d661602
    expectEqual(Solution().strStr("sadbutsad", "sad"), 0, "match-at-start")
    expectEqual(Solution().strStr("leetcode", "leeto"), -1, "missing-needle")
    expectEqual(Solution().strStr("mississippi", "issip"), 4, "match-in-middle")
    expectEqual(Solution().strStr("a", "aa"), -1, "needle-longer-than-haystack")
    expectEqual(Solution().strStr("a", "a"), 0, "single-character-match")
    // EXCLUDED_VECTOR empty-needle: ["abc",""] | The needle must contain at least one character.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
