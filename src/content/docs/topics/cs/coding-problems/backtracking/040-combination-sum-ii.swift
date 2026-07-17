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
    func combinationSum2(_ candidates: [Int], _ target: Int) -> [[Int]] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:e5519429379e0f2d230af1238b327c66cec643e2f8d2485503c456e1a7917fcc
    expectEqual(Solution().combinationSum2([10, 1, 2, 7, 6, 1, 5], 8), [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]], "canonical")
    expectEqual(Solution().combinationSum2([2, 5, 2, 1, 2], 5), [[1, 2, 2], [5]], "second")
    expectEqual(Solution().combinationSum2([3, 4], 2), [], "none")
    expectEqual(Solution().combinationSum2([1], 1), [[1]], "single")
    expectEqual(Solution().combinationSum2([1, 1], 1), [[1]], "duplicate-only")
    // EXCLUDED_VECTOR nonpositive: [[0,1],1] | Candidates are positive integers.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
