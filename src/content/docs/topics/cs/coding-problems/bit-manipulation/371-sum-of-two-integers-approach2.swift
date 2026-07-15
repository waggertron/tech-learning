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
    func getSum(_ a: Int, _ b: Int) -> Int {
        var partial = UInt32(bitPattern: Int32(a))
        var carry = UInt32(bitPattern: Int32(b))
        while carry != 0 {
            let nextCarry = (partial & carry) << 1
            partial ^= carry
            carry = nextCarry
        }
        return Int(Int32(bitPattern: partial))
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:9ad9e6677c1f650f6bddc7bbdd51c73f4150e9339ef7dba4b153de152b78f640
    expectEqual(Solution().getSum(1, 2), 3, "two-positive-values")
    expectEqual(Solution().getSum(-5, 3), -2, "mixed-sign-values")
    expectEqual(Solution().getSum(-1, 1), 0, "opposites-cancel")
    expectEqual(Solution().getSum(-7, -8), -15, "two-negative-values")
    expectEqual(Solution().getSum(0, 0), 0, "two-zeroes")
    expectEqual(Solution().getSum(-1000, -1000), -2000, "minimum-inputs")
    expectEqual(Solution().getSum(1000, 1000), 2000, "maximum-inputs")
    // EXCLUDED_VECTOR first-input-above-constraint: [1001,0] | Each input must remain in the inclusive range from -1000 through 1000.
    // EXCLUDED_VECTOR second-input-below-constraint: [0,-1001] | Each input must remain in the inclusive range from -1000 through 1000.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
