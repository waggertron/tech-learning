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
    func isHappy(_ n: Int) -> Bool {
        var seen: Set<Int> = []
        var current = n
        while current != 1 && seen.insert(current).inserted {
            current = digitSquareSum(current)
        }
        return current == 1
    }

    private func digitSquareSum(_ value: Int) -> Int {
        var value = value, total = 0
        while value > 0 { let digit = value % 10; total += digit * digit; value /= 10 }
        return total
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d3a9f74b9363c152540124a71d5fc2596b24864cc3a29cd9dda4452ef0d2ecd1
    expectEqual(Solution().isHappy(19), true, "canonical-happy")
    expectEqual(Solution().isHappy(2), false, "canonical-cycle")
    expectEqual(Solution().isHappy(7), true, "single-digit-happy")
    expectEqual(Solution().isHappy(100), true, "larger-happy")
    expectEqual(Solution().isHappy(1), true, "one")
    // EXCLUDED_VECTOR zero: [0] | The input must be a positive integer.
    // EXCLUDED_VECTOR negative: [-7] | The input must be a positive integer.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
