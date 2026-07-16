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
        karatsuba(normalize(num1), normalize(num2))
    }

    private func karatsuba(_ x: String, _ y: String) -> String {
        if x == "0" || y == "0" { return "0" }
        if x.count == 1 && y.count == 1 {
            let a = Int(x.utf8.first.map { $0 - 48 } ?? 0)
            let b = Int(y.utf8.first.map { $0 - 48 } ?? 0)
            return String(a * b)
        }

        let width = max(x.count, y.count)
        let split = width / 2
        let (xHigh, xLow) = parts(x, lowWidth: split)
        let (yHigh, yLow) = parts(y, lowWidth: split)
        let high = karatsuba(xHigh, yHigh)
        let low = karatsuba(xLow, yLow)
        let sums = karatsuba(add(xHigh, xLow), add(yHigh, yLow))
        let cross = subtract(subtract(sums, high), low)
        return add(add(shift(high, by: 2 * split), shift(cross, by: split)), low)
    }

    private func parts(_ value: String, lowWidth: Int) -> (String, String) {
        let bytes = Array(value.utf8)
        let cut = max(0, bytes.count - lowWidth)
        let high = cut == 0 ? "0" : String(decoding: bytes[..<cut], as: UTF8.self)
        let low = String(decoding: bytes[cut...], as: UTF8.self)
        return (normalize(high), normalize(low))
    }

    private func add(_ a: String, _ b: String) -> String {
        let left = Array(a.utf8), right = Array(b.utf8)
        var i = left.count - 1, j = right.count - 1, carry = 0
        var output: [UInt8] = []
        while i >= 0 || j >= 0 || carry > 0 {
            let x = i >= 0 ? Int(left[i] - 48) : 0
            let y = j >= 0 ? Int(right[j] - 48) : 0
            let total = x + y + carry
            output.append(UInt8(total % 10 + 48))
            carry = total / 10
            i -= 1
            j -= 1
        }
        return String(decoding: output.reversed(), as: UTF8.self)
    }

    private func subtract(_ a: String, _ b: String) -> String {
        let left = Array(a.utf8), right = Array(b.utf8)
        var i = left.count - 1, j = right.count - 1, borrow = 0
        var output: [UInt8] = []
        while i >= 0 {
            var digit = Int(left[i] - 48) - borrow
            let other = j >= 0 ? Int(right[j] - 48) : 0
            if digit < other { digit += 10; borrow = 1 } else { borrow = 0 }
            output.append(UInt8(digit - other + 48))
            i -= 1
            j -= 1
        }
        return normalize(String(decoding: output.reversed(), as: UTF8.self))
    }

    private func shift(_ value: String, by places: Int) -> String {
        value == "0" ? "0" : value + String(repeating: "0", count: places)
    }

    private func normalize(_ value: String) -> String {
        let trimmed = value.drop(while: { $0 == "0" })
        return trimmed.isEmpty ? "0" : String(trimmed)
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
