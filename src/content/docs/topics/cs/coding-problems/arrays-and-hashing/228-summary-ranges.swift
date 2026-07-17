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
    func summaryRanges(_ nums: [Int]) -> [String] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:8170795d5a9d1ceebb0fb052f8b63331397defb9fe37134b4e793555400a1b21
    expectEqual(Solution().summaryRanges([0, 1, 2, 4, 5, 7]), ["0->2", "4->5", "7"], "canonical")
    expectEqual(Solution().summaryRanges([0, 2, 3, 4, 6, 8, 9]), ["0", "2->4", "6", "8->9"], "mixed")
    expectEqual(Solution().summaryRanges([]), [], "empty")
    expectEqual(Solution().summaryRanges([-1]), ["-1"], "single")
    expectEqual(Solution().summaryRanges([1, 2, 3]), ["1->3"], "all-run")
    // EXCLUDED_VECTOR unsorted: [[2,1]] | The input is sorted and contains unique values.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
