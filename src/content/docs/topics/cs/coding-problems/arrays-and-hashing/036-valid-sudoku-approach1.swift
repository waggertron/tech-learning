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
        for row in 0..<9 {
            var seen = Set<String>()
            for col in 0..<9 where board[row][col] != "." { if !seen.insert(board[row][col]).inserted { return false } }
        }
        for col in 0..<9 {
            var seen = Set<String>()
            for row in 0..<9 where board[row][col] != "." { if !seen.insert(board[row][col]).inserted { return false } }
        }
        for boxRow in stride(from: 0, to: 9, by: 3) {
            for boxCol in stride(from: 0, to: 9, by: 3) {
                var seen = Set<String>()
                for row in boxRow..<(boxRow + 3) { for col in boxCol..<(boxCol + 3) where board[row][col] != "." {
                    if !seen.insert(board[row][col]).inserted { return false }
                }}
            }
        }
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
