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
    func eraseOverlapIntervals(_ intervals: [[Int]]) -> Int {
        let sorted = intervals.sorted { $0[1] < $1[1] }
        var best = Array(repeating: 1, count: sorted.count)
        for right in sorted.indices {
            for left in 0..<right where sorted[left][1] <= sorted[right][0] { best[right] = max(best[right], best[left] + 1) }
        }
        return sorted.count - best.max()!
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c8a6fd94eff079de0f3e019ff7cebe93aebf292e8350aca5a0a4b7ed9a91a341
    expectEqual(Solution().eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]), 1, "remove-one-duplicate-overlap")
    expectEqual(Solution().eraseOverlapIntervals([[1, 2], [1, 2], [1, 2]]), 2, "all-intervals-overlap")
    expectEqual(Solution().eraseOverlapIntervals([[1, 2], [2, 3]]), 0, "touching-is-not-overlap")
    expectEqual(Solution().eraseOverlapIntervals([[1, 2]]), 0, "single-interval")
    // EXCLUDED_VECTOR empty-interval-list: [[]] | The problem contract requires at least one interval.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
