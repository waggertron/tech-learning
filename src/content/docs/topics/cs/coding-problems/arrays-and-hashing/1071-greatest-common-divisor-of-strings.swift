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
    func gcdOfStrings(_ str1: String, _ str2: String) -> String {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3cab289c8111a2002779e3ed9d79e0c2d11ef4dc0003ecadd1d5cc1b1bed0137
    expectEqual(Solution().gcdOfStrings("ABCABC", "ABC"), "ABC", "repeated-ab")
    expectEqual(Solution().gcdOfStrings("ABABAB", "ABAB"), "AB", "shared-ab")
    expectEqual(Solution().gcdOfStrings("LEET", "CODE"), "", "incompatible")
    expectEqual(Solution().gcdOfStrings("A", "A"), "A", "same")
    expectEqual(Solution().gcdOfStrings("ABAB", "ABAC"), "", "no-full-divisor")
    // EXCLUDED_VECTOR empty: ["","A"] | Both strings are non-empty.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
