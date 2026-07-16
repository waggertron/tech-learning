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
    func characterReplacement(_ s: String, _ k: Int) -> Int {
        let characters = Array(s)
        var best = 0
        for target in Set(characters) {
            var left = 0, replacements = 0
            for right in characters.indices {
                if characters[right] != target { replacements += 1 }
                while replacements > k { if characters[left] != target { replacements -= 1 }; left += 1 }
                best = max(best, right - left + 1)
            }
        }
        return best
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:72f73a6f812e70ebdd895fa17f8cfa28354d4379643074a189fb1b5d2422dcb7
    expectEqual(Solution().characterReplacement("ABAB", 2), 4, "two-replacements")
    expectEqual(Solution().characterReplacement("AABABBA", 1), 4, "one-replacement")
    expectEqual(Solution().characterReplacement("ABCD", 1), 2, "all-distinct")
    expectEqual(Solution().characterReplacement("AABA", 0), 2, "no-replacements")
    expectEqual(Solution().characterReplacement("A", 0), 1, "single-character")
    // EXCLUDED_VECTOR empty-string: ["",1] | The input string must contain at least one uppercase letter.
    // EXCLUDED_VECTOR negative-budget: ["ABC",-1] | The replacement budget cannot be negative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
