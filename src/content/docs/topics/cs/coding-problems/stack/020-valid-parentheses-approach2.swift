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
    func isValid(_ s: String) -> Bool {
        var stack: [Character] = []
        for character in s {
            if character == "(" || character == "[" || character == "{" {
                stack.append(character)
            } else {
                guard let opening = stack.popLast() else { return false }
                if character == ")" && opening != "(" { return false }
                if character == "]" && opening != "[" { return false }
                if character == "}" && opening != "{" { return false }
            }
        }
        return stack.isEmpty
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:29a7264a4f1f71276890a7ac463b6a9529d365e70986679cdba2b5390d341b56
    expectEqual(Solution().isValid("()"), true, "single-pair")
    expectEqual(Solution().isValid("()[]{}"), true, "mixed-pairs")
    expectEqual(Solution().isValid("(]"), false, "wrong-type")
    expectEqual(Solution().isValid("([)]"), false, "crossed-order")
    expectEqual(Solution().isValid("{[]}"), true, "nested-pairs")
    // EXCLUDED_VECTOR empty-string: [""] | The published input contains at least one bracket.
    // EXCLUDED_VECTOR non-bracket: ["(a)"] | The input alphabet contains only bracket characters.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
