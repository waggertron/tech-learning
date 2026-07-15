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
    func countBits(_ n: Int) -> [Int] {
        var counts = Array(repeating: 0, count: n + 1)
        guard n > 0 else { return counts }
        for value in 1...n {
            counts[value] = counts[value & (value - 1)] + 1
        }
        return counts
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c6ee896d6c38441fea68d4a24bb494a2ee8d855229cff1259c3e14c3c9159da0
    expectEqual(Solution().countBits(2), [0, 1, 1], "through-two")
    expectEqual(Solution().countBits(5), [0, 1, 1, 2, 1, 2], "through-five")
    expectEqual(Solution().countBits(8), [0, 1, 1, 2, 1, 2, 2, 3, 1], "through-eight")
    expectEqual(Solution().countBits(0), [0], "zero")
    expectEqual(Solution().countBits(1), [0, 1], "one")
    // EXCLUDED_VECTOR negative-input: [-1] | The input contract requires n to be nonnegative.
    // EXCLUDED_VECTOR above-constraint: [100001] | The published problem constraint limits n to 100000.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
