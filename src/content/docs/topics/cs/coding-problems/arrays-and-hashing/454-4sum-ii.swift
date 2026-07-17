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
    func fourSumCount(_ nums1: [Int], _ nums2: [Int], _ nums3: [Int], _ nums4: [Int]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:30ac8a25256273910ec0ebe9364ef04ed52602f4f0d189f20bb2a99095f6dd65
    expectEqual(Solution().fourSumCount([1, 2], [-2, -1], [-1, 2], [0, 2]), 2, "canonical")
    expectEqual(Solution().fourSumCount([0], [0], [0], [0]), 1, "zeros")
    expectEqual(Solution().fourSumCount([-1, -1], [-1, 1], [-1, 1], [1, -1]), 6, "duplicates")
    expectEqual(Solution().fourSumCount([1], [1], [1], [1]), 0, "no-match")
    expectEqual(Solution().fourSumCount([0, 0], [0], [0], [0]), 2, "multiple")
    // EXCLUDED_VECTOR different-length: [[1],[1,2],[1],[1]] | The four arrays have equal length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
