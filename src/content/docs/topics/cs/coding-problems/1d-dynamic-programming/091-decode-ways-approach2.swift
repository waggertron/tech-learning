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
    func numDecodings(_ s: String) -> Int { let c = Array(s); var memo: [Int: Int] = [:]; func solve(_ i: Int) -> Int { if i == c.count { return 1 }; if c[i] == "0" { return 0 }; if let value = memo[i] { return value }; var total = solve(i + 1); if i + 1 < c.count, let pair = Int(String(c[i...i + 1])), pair <= 26 { total += solve(i + 2) }; memo[i] = total; return total }; return solve(0) }
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
