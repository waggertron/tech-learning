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
    @discardableResult
    func compress(_ chars: inout [String]) -> Int {
        let originalCount = chars.count
        var read = 0
        var write = 0
        while read < originalCount {
            let character = chars[read]
            var end = read
            while end < originalCount && chars[end] == character { end += 1 }
            chars[write] = character
            write += 1
            let count = end - read
            if count > 1 {
                for digit in String(count) {
                    chars[write] = String(digit)
                    write += 1
                }
            }
            read = end
        }
        if write < chars.count { chars.removeSubrange(write..<chars.count) }
        return write
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:987ac3bc340cdc88aee97d21203e884e41c3576c84352757a4abd8e0a34409ed
    var argument1 = ["a", "a", "b", "b", "c", "c", "c"]
    Solution().compress(&argument1)
    expectEqual(argument1, ["a", "2", "b", "2", "c", "3"], "mixed-groups")
    var argument2 = ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"]
    Solution().compress(&argument2)
    expectEqual(argument2, ["a", "b", "1", "2"], "two-digit-count")
    var argument3 = ["a", "a", "a", "b", "a", "a"]
    Solution().compress(&argument3)
    expectEqual(argument3, ["a", "3", "b", "a", "2"], "separate-groups")
    var argument4 = ["a"]
    Solution().compress(&argument4)
    expectEqual(argument4, ["a"], "single-character")
    // EXCLUDED_VECTOR empty-array: [[]] | The published input contains at least one character.
    // EXCLUDED_VECTOR multi-character-element: [["ab"]] | Each array element must contain exactly one character.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
