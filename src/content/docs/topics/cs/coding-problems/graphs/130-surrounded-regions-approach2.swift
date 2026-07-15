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
        let rows = board.count, cols = board[0].count
        func mark(_ row: Int, _ col: Int) {
            if row < 0 || row >= rows || col < 0 || col >= cols || board[row][col] != "O" { return }
            board[row][col] = "E"
            mark(row + 1, col); mark(row - 1, col); mark(row, col + 1); mark(row, col - 1)
        }
        for row in 0..<rows { mark(row, 0); mark(row, cols - 1) }
        for col in 0..<cols { mark(0, col); mark(rows - 1, col) }
        for row in 0..<rows {
            for col in 0..<cols { board[row][col] = board[row][col] == "E" ? "O" : "X" }
        }
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
