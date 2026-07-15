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
        let rows = grid.count, cols = grid[0].count
        var seen = Set<Int>(), islands = 0
        for row in 0..<rows {
            for col in 0..<cols where grid[row][col] == "1" && !seen.contains(row * cols + col) {
                islands += 1
                var queue = [(row, col)], head = 0
                seen.insert(row * cols + col)
                while head < queue.count {
                    let (r, c) = queue[head]; head += 1
                    for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
                        let nr = r + dr, nc = c + dc, key = nr * cols + nc
                        if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == "1" && seen.insert(key).inserted {
                            queue.append((nr, nc))
                        }
                    }
                }
            }
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
