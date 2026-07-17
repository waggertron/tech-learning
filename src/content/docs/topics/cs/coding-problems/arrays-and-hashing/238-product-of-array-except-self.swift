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
    func productExceptSelf(_ nums: [Int]) -> [Int] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c18be99084dbf1d96fb5ca0a038674f10088ca91fcc46d9a3eb94c12c217506a
    expectEqual(Solution().productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6], "canonical")
    expectEqual(Solution().productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0], "contains-zero")
    expectEqual(Solution().productExceptSelf([2, 3]), [3, 2], "two")
    expectEqual(Solution().productExceptSelf([1, 0]), [0, 1], "one-zero")
    expectEqual(Solution().productExceptSelf([0, 0, 2]), [0, 0, 0], "two-zeros")
    // EXCLUDED_VECTOR single: [[5]] | The input contains at least two values.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
