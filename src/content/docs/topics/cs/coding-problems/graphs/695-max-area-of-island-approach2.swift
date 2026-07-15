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
    func maxAreaOfIsland(_ grid: [[Int]]) -> Int {
        let rows = grid.count, cols = grid[0].count
        var seen = Set<Int>(), best = 0
        for row in 0..<rows { for col in 0..<cols where grid[row][col] == 1 && !seen.contains(row * cols + col) {
            var queue = [(row, col)], head = 0, area = 0
            seen.insert(row * cols + col)
            while head < queue.count {
                let (r, c) = queue[head]; head += 1; area += 1
                for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
                    let nr = r + dr, nc = c + dc, key = nr * cols + nc
                    if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1 && seen.insert(key).inserted { queue.append((nr, nc)) }
                }
            }
            best = max(best, area)
        } }
        return best
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:677de97f3bc4766e7dbc445486e59fe5854eccf50748f69c80a72042749389cc
    expectEqual(Solution().maxAreaOfIsland([[0, 0, 1], [1, 1, 1], [0, 1, 0]]), 5, "five-cell-island")
    expectEqual(Solution().maxAreaOfIsland([[1, 0, 1], [0, 0, 0], [1, 1, 0]]), 2, "separate-islands")
    expectEqual(Solution().maxAreaOfIsland([[0]]), 0, "single-water-cell")
    // EXCLUDED_VECTOR ragged-grid: [[[1,0],[1]]] | The problem contract requires a rectangular grid.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
