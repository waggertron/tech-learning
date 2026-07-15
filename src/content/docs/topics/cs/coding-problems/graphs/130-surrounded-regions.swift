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
    func solve(_ board: inout [[Character]]) {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:45407c2186229e6043dafb5fec22a8c46484988501dd38817e3db7f6bcfc4577
    var argument1: [[Character]] = [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]
    Solution().solve(&argument1)
    expectEqual(argument1, [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]], "captures-enclosed-region")
    var argument2: [[Character]] = [["O", "O"], ["O", "O"]]
    Solution().solve(&argument2)
    expectEqual(argument2, [["O", "O"], ["O", "O"]], "preserves-border-region")
    var argument3: [[Character]] = [["O"]]
    Solution().solve(&argument3)
    expectEqual(argument3, [["O"]], "single-open-cell")
    // EXCLUDED_VECTOR ragged-board: [[["X","O"],["X"]]] | The problem contract requires a rectangular board.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
