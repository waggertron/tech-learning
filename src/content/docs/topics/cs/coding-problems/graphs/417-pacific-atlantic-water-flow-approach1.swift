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
    func pacificAtlantic(_ heights: [[Int]]) -> [[Int]] {
        let rows = heights.count, cols = heights[0].count
        func reachesBoth(_ startRow: Int, _ startCol: Int) -> Bool {
            var stack = [(startRow, startCol)], seen = Set([startRow * cols + startCol])
            var pacific = false, atlantic = false
            while let (row, col) = stack.popLast() {
                if row == 0 || col == 0 { pacific = true }
                if row == rows - 1 || col == cols - 1 { atlantic = true }
                for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
                    let nr = row + dr, nc = col + dc, key = nr * cols + nc
                    if nr >= 0 && nr < rows && nc >= 0 && nc < cols && heights[nr][nc] <= heights[row][col] && seen.insert(key).inserted {
                        stack.append((nr, nc))
                    }
                }
            }
            return pacific && atlantic
        }
        var result: [[Int]] = []
        for row in 0..<rows { for col in 0..<cols where reachesBoth(row, col) { result.append([row, col]) } }
        return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d27bb91285b61e76ecf343b26656765b5de86510179704b6dd19e490d147dbb5
    expectEqual(Solution().pacificAtlantic([[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]), [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]], "canonical-heights")
    expectEqual(Solution().pacificAtlantic([[1, 1], [1, 1]]), [[0, 0], [0, 1], [1, 0], [1, 1]], "flat-grid")
    expectEqual(Solution().pacificAtlantic([[7]]), [[0, 0]], "single-cell")
    // EXCLUDED_VECTOR ragged-grid: [[[1,2],[3]]] | The problem contract requires a rectangular heights matrix.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
