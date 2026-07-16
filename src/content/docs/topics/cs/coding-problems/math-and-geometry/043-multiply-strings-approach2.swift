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
    func multiply(_ num1: String, _ num2: String) -> String {
        if num1 == "0" || num2 == "0" { return "0" }
        let left = Array(num1.utf8).map { Int($0 - 48) }
        let right = Array(num2.utf8).map { Int($0 - 48) }
        var digits = Array(repeating: 0, count: left.count + right.count)

        for i in left.indices.reversed() {
            for j in right.indices.reversed() {
                let position = i + j + 1
                let total = left[i] * right[j] + digits[position]
                digits[position] = total % 10
                digits[position - 1] += total / 10
            }
        }

        let first = digits.firstIndex(where: { $0 != 0 }) ?? digits.count - 1
        return digits[first...].map(String.init).joined()
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:0386e49d24f222dffc00a24793c4ab2bf3764ceeb712089c109d27fb19e8c8a3
    expectEqual(Solution().multiply("2", "3"), "6", "single-digits")
    expectEqual(Solution().multiply("123", "456"), "56088", "different-length-operands")
    expectEqual(Solution().multiply("999", "999"), "998001", "repeated-carry")
    expectEqual(Solution().multiply("0", "12345"), "0", "zero-product")
    expectEqual(Solution().multiply("1", "9"), "9", "identity-product")
    // EXCLUDED_VECTOR leading-zero: ["00","2"] | Operands use canonical decimal strings without leading zeroes.
    // EXCLUDED_VECTOR non-digit-character: ["12a","3"] | Operands contain decimal digits only.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
