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
    func twoSum(_ numbers: [Int], _ target: Int) -> [Int] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3962c23c1c450f3ab66af4bac8c336a4b23468aa59897e7d04861fbc2050a1ce
    expectEqual(Solution().twoSum([2, 7, 11, 15], 9), [1, 2], "first-pair")
    expectEqual(Solution().twoSum([2, 3, 4], 6), [1, 3], "outer-pair")
    expectEqual(Solution().twoSum([-1, 0], -1), [1, 2], "negative-values")
    expectEqual(Solution().twoSum([1, 2], 3), [1, 2], "minimum-length")
    // EXCLUDED_VECTOR unsorted-input: [[3,2,4],6] | The input array must be sorted in nondecreasing order.
    // EXCLUDED_VECTOR no-solution: [[1,2,3],8] | The published problem guarantees exactly one solution.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
