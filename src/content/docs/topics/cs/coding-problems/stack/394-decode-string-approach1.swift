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
    func decodeString(_ s: String) -> String {
        var stack: [(count: Int, prefix: String)] = []
        var current = ""
        var count = 0
        for character in s {
            if let digit = character.wholeNumberValue {
                count = count * 10 + digit
            } else if character == "[" {
                stack.append((count, current))
                count = 0
                current = ""
            } else if character == "]" {
                let frame = stack.removeLast()
                current = frame.prefix + String(repeating: current, count: frame.count)
            } else {
                current.append(character)
            }
        }
        return current
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:8b5dfc0339f8e16e9f3d86cb002b9790d1f201d37e93e3e8f5309816ae373ca5
    expectEqual(Solution().decodeString("3[a]2[bc]"), "aaabcbc", "two-groups")
    expectEqual(Solution().decodeString("3[a2[c]]"), "accaccacc", "nested-group")
    expectEqual(Solution().decodeString("2[abc]3[cd]ef"), "abcabccdcdcdef", "suffix-text")
    expectEqual(Solution().decodeString("a"), "a", "plain-text")
    // EXCLUDED_VECTOR empty-string: [""] | The published input contains at least one character.
    // EXCLUDED_VECTOR unclosed-group: ["3[a"] | The encoded string is guaranteed to be valid.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
