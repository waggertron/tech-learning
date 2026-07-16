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
    func minRemoveToMakeValid(_ s: String) -> String {
        let characters = Array(s)
        var openings: [Int] = []
        var remove: Set<Int> = []
        for index in characters.indices {
            if characters[index] == "(" {
                openings.append(index)
            } else if characters[index] == ")" {
                if openings.isEmpty { remove.insert(index) } else { openings.removeLast() }
            }
        }
        remove.formUnion(openings)
        return String(characters.enumerated().compactMap { remove.contains($0.offset) ? nil : $0.element })
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:798875e0ad1ed0f225e41e7faa07f5110c8d6a62604e2f8c2bd209ead30baa44
    expectEqual(Solution().minRemoveToMakeValid("lee(t(c)o)de)"), "lee(t(c)o)de", "already-fixable")
    expectEqual(Solution().minRemoveToMakeValid("a)b(c)d"), "ab(c)d", "remove-middle-close")
    expectEqual(Solution().minRemoveToMakeValid("))(("), "", "all-invalid")
    expectEqual(Solution().minRemoveToMakeValid("(a(b(c)d)"), "a(b(c)d)", "remove-outer-open")
    expectEqual(Solution().minRemoveToMakeValid("abc"), "abc", "letters-only")
    // EXCLUDED_VECTOR empty-string: [""] | The published input contains at least one character.
    // EXCLUDED_VECTOR unsupported-symbol: ["a+b"] | The input alphabet contains lowercase letters and parentheses.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
