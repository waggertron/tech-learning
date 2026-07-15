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
    func reverse(_ x: Int) -> Int {
        let sign = x < 0 ? -1 : 1
        var remaining = abs(x)
        var result = 0

        while remaining != 0 {
            result = result * 10 + remaining % 10
            remaining /= 10
        }

        result *= sign
        let lowerBound = Int(Int32.min)
        let upperBound = Int(Int32.max)
        return (lowerBound...upperBound).contains(result) ? result : 0
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:b6d67931019bc6338f4975fb29ca0cc472cbc2271bec13e8815cbe3d37aa17c2
    expectEqual(Solution().reverse(123), 321, "positive")
    expectEqual(Solution().reverse(-123), -321, "negative")
    expectEqual(Solution().reverse(120), 21, "trailing-zero")
    expectEqual(Solution().reverse(1534236469), 0, "positive-overflow")
    expectEqual(Solution().reverse(0), 0, "zero")
    expectEqual(Solution().reverse(1463847412), 2147483641, "largest-reversible")
    expectEqual(Solution().reverse(-2147483648), 0, "minimum-int-overflows-when-reversed")
    // EXCLUDED_VECTOR outside-signed-32-bit-range: [2147483648] | The input contract accepts only signed 32-bit integers.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
