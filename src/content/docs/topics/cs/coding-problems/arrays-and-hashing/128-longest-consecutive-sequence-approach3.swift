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
    func longestConsecutive(_ nums: [Int]) -> Int {
        let values = Set(nums); var best = 0
        for value in values where !values.contains(value - 1) { var current = value, length = 1; while values.contains(current + 1) { current += 1; length += 1 }; best = max(best, length) }
        return best
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:800b923d8dbc5dcbbfbe542a820e99c5ed254a0920c23bb67d040878cadd78d3
    expectEqual(Solution().longestConsecutive([100, 4, 200, 1, 3, 2]), 4, "canonical")
    expectEqual(Solution().longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9, "long-run")
    expectEqual(Solution().longestConsecutive([]), 0, "empty")
    expectEqual(Solution().longestConsecutive([1]), 1, "single")
    expectEqual(Solution().longestConsecutive([5, 4, 3, 2, 1]), 5, "descending")
    expectEqual(Solution().longestConsecutive([1, 2, 2, 3]), 3, "duplicates")
    // EXCLUDED_VECTOR outside-value-bounds: [[1000000001]] | Values stay within the documented integer bounds.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
