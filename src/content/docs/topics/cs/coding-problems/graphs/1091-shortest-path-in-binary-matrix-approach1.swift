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
    func shortestPathBinaryMatrix(_ grid: [[Int]]) -> Int {
        let n = grid.count
        if grid[0][0] != 0 || grid[n - 1][n - 1] != 0 { return -1 }
        var queue = [(0, 0, 1)]
        var head = 0
        var seen = Set([0])
        while head < queue.count {
            let (row, col, distance) = queue[head]
            head += 1
            if row == n - 1 && col == n - 1 { return distance }
            for dr in -1...1 {
                for dc in -1...1 where dr != 0 || dc != 0 {
                    let nr = row + dr, nc = col + dc
                    let key = nr * n + nc
                    if nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0 && !seen.contains(key) {
                        seen.insert(key)
                        queue.append((nr, nc, distance + 1))
                    }
                }
            }
        }
        return -1
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3d87ba407d5e5c0de661a8c7a1747e5cb1e2400480d43125bd43b517652d5433
    expectEqual(Solution().shortestPathBinaryMatrix([[0, 1], [1, 0]]), 2, "diagonal-path")
    expectEqual(Solution().shortestPathBinaryMatrix([[0, 0, 0], [1, 1, 0], [1, 1, 0]]), 4, "winding-path")
    expectEqual(Solution().shortestPathBinaryMatrix([[0]]), 1, "single-open-cell")
    // EXCLUDED_VECTOR ragged-grid: [[[0,0],[0]]] | The problem contract requires a square matrix.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
