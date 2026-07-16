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
    func generateParenthesis(_ n: Int) -> [String] {
        var result: [String] = []
        var path: [Character] = []
        func backtrack(_ opens: Int, _ closes: Int) {
            if opens == n && closes == n { result.append(String(path)); return }
            if opens < n {
                path.append("(")
                backtrack(opens + 1, closes)
                path.removeLast()
            }
            if closes < opens {
                path.append(")")
                backtrack(opens, closes + 1)
                path.removeLast()
            }
        }
        backtrack(0, 0)
        return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d3a7ffb42f677c4e902902d694f8e05624e80ae56a6e689b473679e61a591fff
    expectEqual(Solution().generateParenthesis(2), ["(())", "()()"], "two-pairs")
    expectEqual(Solution().generateParenthesis(3), ["((()))", "(()())", "(())()", "()(())", "()()()"], "three-pairs")
    expectEqual(Solution().generateParenthesis(1), ["()"], "single-pair")
    // EXCLUDED_VECTOR zero-pairs: [0] | The published range starts at one pair.
    // EXCLUDED_VECTOR negative-pairs: [-1] | The pair count must be positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
