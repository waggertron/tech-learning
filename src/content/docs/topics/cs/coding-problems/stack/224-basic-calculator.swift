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
    func calculate(_ s: String) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:0cb2d9c6ba2577e11f370788229398a79f76a6284efdbc123e6fbc57c2f5cebb
    expectEqual(Solution().calculate("1 + 1"), 2, "simple-addition")
    expectEqual(Solution().calculate(" 2-1 + 2 "), 3, "mixed-signs")
    expectEqual(Solution().calculate("(1+(4+5+2)-3)+(6+8)"), 23, "nested-groups")
    expectEqual(Solution().calculate("-(2+3)+10"), 5, "unary-before-group")
    expectEqual(Solution().calculate("0"), 0, "zero")
    // EXCLUDED_VECTOR empty-expression: [""] | The published expression contains at least one character.
    // EXCLUDED_VECTOR unsupported-operator: ["1*2"] | Only addition, subtraction, parentheses, digits, and spaces are supported.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
