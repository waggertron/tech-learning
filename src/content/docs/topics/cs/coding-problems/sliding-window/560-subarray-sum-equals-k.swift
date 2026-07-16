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
    func subarraySum(_ nums: [Int], _ k: Int) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:16683db5ea272bd085984ea13a2f105fe0b895f3913582258e13bc113512f0e2
    expectEqual(Solution().subarraySum([1, 1, 1], 2), 2, "two-overlapping-subarrays")
    expectEqual(Solution().subarraySum([1, 2, 3], 3), 2, "different-length-subarrays")
    expectEqual(Solution().subarraySum([1, -1, 0], 0), 3, "negative-and-zero-values")
    expectEqual(Solution().subarraySum([-1, -1, 1], -1), 3, "negative-target")
    expectEqual(Solution().subarraySum([0], 0), 1, "single-zero")
    // EXCLUDED_VECTOR empty-array: [[],0] | The array must contain at least one integer.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
