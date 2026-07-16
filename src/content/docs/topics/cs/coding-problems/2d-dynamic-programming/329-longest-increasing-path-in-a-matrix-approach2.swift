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
    func longestIncreasingPath(_ matrix: [[Int]]) -> Int {
        let rows = matrix.count, cols = matrix[0].count, directions = [(1,0),(-1,0),(0,1),(0,-1)]; var memo = Array(repeating: Array(repeating: 0, count: cols), count: rows)
        func dfs(_ row: Int, _ col: Int) -> Int { if memo[row][col] != 0 { return memo[row][col] }; var best = 1; for (dr, dc) in directions { let r = row + dr, c = col + dc; if r >= 0 && r < rows && c >= 0 && c < cols && matrix[r][c] > matrix[row][col] { best = max(best, 1 + dfs(r, c)) } }; memo[row][col] = best; return best }
        var answer = 0; for row in 0..<rows { for col in 0..<cols { answer = max(answer, dfs(row, col)) } }; return answer
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:461c520f30965fe5fc90e027c99b48d5f58f29ae44429ca6ac004bbbd99ac828
    expectEqual(Solution().longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]), 4, "canonical")
    expectEqual(Solution().longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]]), 4, "second-example")
    expectEqual(Solution().longestIncreasingPath([[1, 2, 3]]), 3, "single-row")
    expectEqual(Solution().longestIncreasingPath([[2, 2], [2, 2]]), 1, "flat")
    expectEqual(Solution().longestIncreasingPath([[1]]), 1, "single-cell")
    // EXCLUDED_VECTOR empty-matrix: [[]] | The matrix has at least one row and column.
    // EXCLUDED_VECTOR ragged-matrix: [[[1,2],[3]]] | Every matrix row has the same length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
