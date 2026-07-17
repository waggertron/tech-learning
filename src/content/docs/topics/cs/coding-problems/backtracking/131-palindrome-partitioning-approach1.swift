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
    func partition(_ s: String) -> [[String]] {
        let chars = Array(s); var result: [[String]] = []
        func search(_ start: Int, _ current: [String]) { if start == chars.count { result.append(current); return }; for end in start..<chars.count { let piece = String(chars[start...end]); if Array(piece) == Array(piece.reversed()) { search(end + 1, current + [piece]) } } }
        search(0, []); return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cf9a620e92a81c72209c7758fdcf7b1fcc53468baad91972e5eabae593d1d1cc
    expectEqual(Solution().partition("aab"), [["a", "a", "b"], ["aa", "b"]], "aab")
    expectEqual(Solution().partition("a"), [["a"]], "single")
    expectEqual(Solution().partition("aa"), [["a", "a"], ["aa"]], "double")
    expectEqual(Solution().partition("abc"), [["a", "b", "c"]], "distinct")
    expectEqual(Solution().partition("aba"), [["a", "b", "a"], ["aba"]], "palindrome")
    // EXCLUDED_VECTOR empty: [""] | The input contains at least one lowercase letter.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
