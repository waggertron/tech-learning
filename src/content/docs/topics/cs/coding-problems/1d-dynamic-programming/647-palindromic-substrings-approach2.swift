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
    func countSubstrings(_ s: String) -> Int { let c = Array(s); var count = 0; func expand(_ a: Int, _ b: Int) { var l = a, r = b; while l >= 0 && r < c.count && c[l] == c[r] { count += 1; l -= 1; r += 1 } }; for i in c.indices { expand(i, i); expand(i, i + 1) }; return count }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:fb686e1e036999895d287297a7b8af8194403d2477ffe7b42288692680a3fdb0
    expectEqual(Solution().countSubstrings("abc"), 3, "distinct")
    expectEqual(Solution().countSubstrings("aaa"), 6, "repeated")
    expectEqual(Solution().countSubstrings("abba"), 6, "even-center")
    expectEqual(Solution().countSubstrings("a"), 1, "single-character")
    // EXCLUDED_VECTOR empty-string: [""] | The published input contains at least one character.
    // EXCLUDED_VECTOR non-ascii: ["été"] | The runnable contract uses the published ASCII alphabet.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
