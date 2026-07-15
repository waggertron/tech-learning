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
        var queue: [(Int, Int)] = [], head = 0
        func enqueue(_ row: Int, _ col: Int) {
            if board[row][col] == "O" { board[row][col] = "E"; queue.append((row, col)) }
        }
        for row in 0..<rows { enqueue(row, 0); enqueue(row, cols - 1) }
        for col in 0..<cols { enqueue(0, col); enqueue(rows - 1, col) }
        for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
            _ = dr; _ = dc
        }
        let directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while head < queue.count {
            let (row, col) = queue[head]; head += 1
            for (dr, dc) in directions {
                let nr = row + dr, nc = col + dc
                if nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] == "O" {
                    board[nr][nc] = "E"; queue.append((nr, nc))
                }
            }
        }
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
