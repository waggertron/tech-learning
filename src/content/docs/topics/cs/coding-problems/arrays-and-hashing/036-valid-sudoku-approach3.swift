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
    func isValidSudoku(_ board: [[String]]) -> Bool {
        var rows = Array(repeating: 0, count: 9), columns = rows, boxes = rows
        for row in 0..<9 { for col in 0..<9 {
            let value = board[row][col]
            if value == "." { continue }
            let bit = 1 << (Int(value)! - 1), box = (row / 3) * 3 + col / 3
            if rows[row] & bit != 0 || columns[col] & bit != 0 || boxes[box] & bit != 0 { return false }
            rows[row] |= bit; columns[col] |= bit; boxes[box] |= bit
        }}
        return true
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:b045b165588951931bcce03aadb4e2de0aa6292650ce8b731cded40725966a59
    expectEqual(Solution().isValidSudoku([["5", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]]), true, "valid-board")
    expectEqual(Solution().isValidSudoku([["5", "3", ".", ".", "7", ".", ".", ".", "5"], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]]), false, "duplicate-row")
    expectEqual(Solution().isValidSudoku([["5", ".", ".", ".", ".", ".", ".", ".", "."], ["5", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."]]), false, "duplicate-column")
    expectEqual(Solution().isValidSudoku([["5", ".", ".", ".", ".", ".", ".", ".", "."], [".", "5", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."]]), false, "duplicate-box")
    expectEqual(Solution().isValidSudoku([[".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."]]), true, "empty-board")
    // EXCLUDED_VECTOR wrong-shape: [[["."]]] | The board is always a 9 by 9 grid.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
