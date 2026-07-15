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
    func orangesRotting(_ grid: [[Int]]) -> Int {
        var grid = grid, minutes = 0
        while true {
            var toRot: [(Int, Int)] = []
            for row in grid.indices { for col in grid[0].indices where grid[row][col] == 1 {
                if [(1,0),(-1,0),(0,1),(0,-1)].contains(where: { dr, dc in
                    let nr = row + dr, nc = col + dc
                    return nr >= 0 && nr < grid.count && nc >= 0 && nc < grid[0].count && grid[nr][nc] == 2
                }) { toRot.append((row, col)) }
            } }
            if toRot.isEmpty { break }
            for (row, col) in toRot { grid[row][col] = 2 }
            minutes += 1
        }
        return grid.joined().contains(1) ? -1 : minutes
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:e513535ace5d26ddc1df8d2541c37b0760830b31c189b3863622d2dd8b85ac5d
    expectEqual(Solution().orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), 4, "four-minutes")
    expectEqual(Solution().orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]), -1, "unreachable-fresh-orange")
    expectEqual(Solution().orangesRotting([[0, 2]]), 0, "no-fresh-oranges")
    // EXCLUDED_VECTOR ragged-grid: [[[2,1],[1]]] | The problem contract requires a rectangular grid.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
