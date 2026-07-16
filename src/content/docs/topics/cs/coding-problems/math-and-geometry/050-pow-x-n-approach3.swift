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
    func myPow(_ x: Double, _ n: Int) -> Double {
        var base = x
        var exponent = n.magnitude
        var result = 1.0
        while exponent > 0 {
            if !exponent.isMultiple(of: 2) { result *= base }
            base *= base
            exponent /= 2
        }
        return n < 0 ? 1.0 / result : result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3d0032f70578d1d3bc5923b8663be43fa315949f007e68ad2fb093392e98efc8
    expectTrue(abs(Solution().myPow(2, 10) - 1024) <= 1e-9 * max(1.0, abs(1024)), "positive-exponent")
    expectTrue(abs(Solution().myPow(2.1, 3) - 9.261) <= 1e-9 * max(1.0, abs(9.261)), "fractional-base")
    expectTrue(abs(Solution().myPow(2, -2) - 0.25) <= 1e-9 * max(1.0, abs(0.25)), "negative-exponent")
    expectTrue(abs(Solution().myPow(2, 0) - 1) <= 1e-9 * max(1.0, abs(1)), "zero-exponent")
    expectTrue(abs(Solution().myPow(0, 5) - 0) <= 1e-9 * max(1.0, abs(0)), "zero-base-positive-exponent")
    expectTrue(abs(Solution().myPow(-2, 3) - -8) <= 1e-9 * max(1.0, abs(-8)), "negative-base")
    // EXCLUDED_VECTOR zero-base-negative-exponent: [0,-1] | Zero raised to a negative exponent is undefined.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
