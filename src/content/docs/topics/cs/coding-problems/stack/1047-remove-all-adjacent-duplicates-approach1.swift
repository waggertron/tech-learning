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
    func removeDuplicates(_ s: String) -> String {
        var characters = Array(s)
        var changed = true
        while changed {
            changed = false
            var next: [Character] = []
            var index = 0
            while index < characters.count {
                if index + 1 < characters.count && characters[index] == characters[index + 1] {
                    changed = true
                    index += 2
                } else {
                    next.append(characters[index])
                    index += 1
                }
            }
            characters = next
        }
        return String(characters)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:b7d375f297878727de443066ba0fad71fab3ef0c9f7584e97943df3d566c1fe5
    expectEqual(Solution().removeDuplicates("abbaca"), "ca", "cascade")
    expectEqual(Solution().removeDuplicates("azxxzy"), "ay", "nested-cascade")
    expectEqual(Solution().removeDuplicates("aaaaaaaa"), "", "all-cancel")
    expectEqual(Solution().removeDuplicates("a"), "a", "single-character")
    // EXCLUDED_VECTOR empty-string: [""] | The published input contains at least one character.
    // EXCLUDED_VECTOR non-lowercase: ["aA"] | The published input contains lowercase English letters only.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
