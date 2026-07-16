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
    func evalRPN(_ tokens: [String]) -> Int {
        let operators: [String: (Int, Int) -> Int] = [
            "+": { $0 + $1 }, "-": { $0 - $1 }, "*": { $0 * $1 }, "/": { $0 / $1 },
        ]
        var stack: [Int] = []
        for token in tokens {
            if let number = Int(token) { stack.append(number); continue }
            let right = stack.removeLast()
            let left = stack.removeLast()
            if let operation = operators[token] { stack.append(operation(left, right)) }
        }
        return stack.last ?? 0
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:012ae168f0fd05bf768ca351f1d8fc6657b439da9945b1499da0a6453a497107
    expectEqual(Solution().evalRPN(["2", "1", "+", "3", "*"]), 9, "multiply-sum")
    expectEqual(Solution().evalRPN(["4", "13", "5", "/", "+"]), 6, "division-and-addition")
    expectEqual(Solution().evalRPN(["7", "-3", "/"]), -2, "truncate-toward-zero")
    expectEqual(Solution().evalRPN(["42"]), 42, "single-number")
    // EXCLUDED_VECTOR empty-expression: [[]] | A valid expression contains at least one token.
    // EXCLUDED_VECTOR missing-operand: [["2","+"]] | Every operator requires two preceding operands.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
