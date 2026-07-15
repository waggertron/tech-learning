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
        var visited = Array(repeating: Array(repeating: false, count: cols), count: rows)
        let directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        for startRow in 0..<rows {
            for startCol in 0..<cols where board[startRow][startCol] == "O" && !visited[startRow][startCol] {
                var stack = [(startRow, startCol)], region: [(Int, Int)] = []
                visited[startRow][startCol] = true
                var touchesBorder = false
                while let (row, col) = stack.popLast() {
                    region.append((row, col))
                    if row == 0 || row == rows - 1 || col == 0 || col == cols - 1 { touchesBorder = true }
                    for (dr, dc) in directions {
                        let nr = row + dr, nc = col + dc
                        if nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] == "O" && !visited[nr][nc] {
                            visited[nr][nc] = true; stack.append((nr, nc))
                        }
                    }
                }
                if !touchesBorder { for (row, col) in region { board[row][col] = "X" } }
            }
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
