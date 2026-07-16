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
    func findCriticalAndPseudoCriticalEdges(_ n: Int, _ edges: [[Int]]) -> [[Int]] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cd6856a28c2475edd2195ad3207aa1bd88187e711510bcc77826cb041b18bf67
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(5, [[0, 1, 1], [1, 2, 1], [2, 3, 2], [0, 3, 2], [0, 4, 3], [3, 4, 3], [1, 4, 6]]), [[0, 1], [2, 3, 4, 5]], "canonical")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(3, [[0, 1, 1], [1, 2, 1], [0, 2, 1]]), [[], [0, 1, 2]], "equal-triangle")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(3, [[0, 1, 1], [1, 2, 2]]), [[0, 1], []], "unique-tree")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 1]]), [[], [0, 1, 2, 3]], "equal-cycle")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(2, [[0, 1, 7]]), [[0], []], "single-edge")
    // EXCLUDED_VECTOR disconnected: [4,[[0,1,1],[2,3,1]]] | The graph is connected.
    // EXCLUDED_VECTOR malformed-edge: [2,[[0,1]]] | Each edge contains two endpoints and one weight.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
