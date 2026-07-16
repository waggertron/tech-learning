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
    func numDecodings(_ s: String) -> Int { let c = Array(s); if c[0] == "0" { return 0 }; var twoBack = 1, oneBack = 1; for i in 1..<c.count { var current = c[i] == "0" ? 0 : oneBack; if let pair = Int(String(c[(i - 1)...i])), pair >= 10 && pair <= 26 { current += twoBack }; twoBack = oneBack; oneBack = current }; return oneBack }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:a0e5efb6ce2e2dcdc3cecaf590953827ce3f73f2a78022e9b60b3cfe616950cd
    expectEqual(Solution().numDecodings("12"), 2, "two-options")
    expectEqual(Solution().numDecodings("226"), 3, "three-options")
    expectEqual(Solution().numDecodings("06"), 0, "leading-zero")
    expectEqual(Solution().numDecodings("2101"), 1, "internal-zero")
    expectEqual(Solution().numDecodings("1"), 1, "single-digit")
    // EXCLUDED_VECTOR empty-string: [""] | The published input contains at least one digit.
    // EXCLUDED_VECTOR non-digit: ["1a"] | The input contains decimal digits only.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
