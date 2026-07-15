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
    func checkValidString(_ s: String) -> Bool {
        var low = 0, high = 0
        for character in s {
            if character == "(" { low += 1; high += 1 }
            else if character == ")" { low = max(0, low - 1); high -= 1 }
            else { low = max(0, low - 1); high += 1 }
            if high < 0 { return false }
        }
        return low == 0
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:e0961030f8b0c8019560f2f03ebb6aad59d74dc9fe583c0b274e5f72f5363b5e
    expectEqual(Solution().checkValidString("(*)"), true, "star-balances-close")
    expectEqual(Solution().checkValidString(")*("), false, "invalid-prefix")
    expectEqual(Solution().checkValidString("*"), true, "single-star")
    // EXCLUDED_VECTOR unsupported-character: ["(a)"] | The input alphabet contains only open parentheses, close parentheses, and stars.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
