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
    func numIslands(_ grid: [[Character]]) -> Int {
        var grid = grid
        let rows = grid.count, cols = grid[0].count
        func sink(_ row: Int, _ col: Int) {
            if row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] != "1" { return }
            grid[row][col] = "0"
            sink(row + 1, col); sink(row - 1, col); sink(row, col + 1); sink(row, col - 1)
        }
        var islands = 0
        for row in 0..<rows {
            for col in 0..<cols where grid[row][col] == "1" { islands += 1; sink(row, col) }
        }
        return islands
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:90546ccc1c6858f851039a36c1b9e7ad005de865846a1f8f43b6605ea27ed65d
    expectEqual(Solution().numIslands([["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]), 3, "three-islands")
    expectEqual(Solution().numIslands([["1", "1"], ["1", "1"]]), 1, "connected-land")
    expectEqual(Solution().numIslands([["0"]]), 0, "single-water-cell")
    // EXCLUDED_VECTOR ragged-grid: [[["1","0"],["1"]]] | The problem contract requires a rectangular grid.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
