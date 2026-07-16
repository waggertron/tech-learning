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
    func insert(_ intervals: [[Int]], _ newInterval: [Int]) -> [[Int]] {
        var result: [[Int]] = []
        var index = 0
        var merged = newInterval
        while index < intervals.count && intervals[index][1] < merged[0] { result.append(intervals[index]); index += 1 }
        while index < intervals.count && intervals[index][0] <= merged[1] { merged[0] = min(merged[0], intervals[index][0]); merged[1] = max(merged[1], intervals[index][1]); index += 1 }
        result.append(merged)
        result.append(contentsOf: intervals[index...])
        return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:699715f26fc448e14037aae540597b85ea7dd25a34d1ef5fe3cb1093d2a3d2b9
    expectEqual(Solution().insert([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]], "merge-one-neighbor")
    expectEqual(Solution().insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), [[1, 2], [3, 10], [12, 16]], "merge-multiple-neighbors")
    expectEqual(Solution().insert([[1, 2], [5, 6]], [3, 4]), [[1, 2], [3, 4], [5, 6]], "insert-between-intervals")
    expectEqual(Solution().insert([], [5, 7]), [[5, 7]], "empty-existing-list")
    // EXCLUDED_VECTOR reversed-new-interval: [[[1,2]],[4,3]] | The new interval must have a start less than or equal to its end.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
