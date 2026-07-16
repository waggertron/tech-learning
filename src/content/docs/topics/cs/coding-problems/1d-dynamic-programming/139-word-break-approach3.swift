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
    func wordBreak(_ s: String, _ wordDict: [String]) -> Bool { let c = Array(s), words = wordDict.map(Array.init); var dp = Array(repeating: false, count: c.count + 1); dp[c.count] = true; for i in stride(from: c.count - 1, through: 0, by: -1) { for word in words where i + word.count <= c.count && Array(c[i..<(i + word.count)]) == word { if dp[i + word.count] { dp[i] = true; break } } }; return dp[0] }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:43588905ac5b19c23f53b1e68ba6ab7d64bceaa9ffd8017f5979a40011d220ee
    expectEqual(Solution().wordBreak("leetcode", ["leet", "code"]), true, "two-words")
    expectEqual(Solution().wordBreak("applepenapple", ["apple", "pen"]), true, "reused-word")
    expectEqual(Solution().wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]), false, "no-segmentation")
    expectEqual(Solution().wordBreak("a", ["a"]), true, "single-word")
    // EXCLUDED_VECTOR empty-string: ["",["a"]] | The published input string is nonempty.
    // EXCLUDED_VECTOR empty-dictionary: ["a",[]] | The published dictionary is nonempty.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
