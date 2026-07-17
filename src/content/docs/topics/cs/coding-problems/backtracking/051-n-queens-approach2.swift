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
    func solveNQueens(_ n: Int) -> [[String]] {
        var result: [[String]] = []
        func safe(_ columns: [Int], _ column: Int) -> Bool { for (row, placed) in columns.enumerated() { let nextRow = columns.count; if placed == column || abs(placed - column) == nextRow - row { return false } }; return true }
        func search(_ columns: [Int]) { if columns.count == n { result.append(columns.map { String(repeating: ".", count: $0) + "Q" + String(repeating: ".", count: n - $0 - 1) }); return }; for column in 0..<n where safe(columns, column) { search(columns + [column]) } }
        search([]); return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:2925ce25625813d3201412d80a4a9469d69e808de0cb9dacc78bbacc30a389ce
    expectEqual(Solution().solveNQueens(4), [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]], "four")
    expectEqual(Solution().solveNQueens(1), [["Q"]], "one")
    expectEqual(Solution().solveNQueens(2), [], "two")
    expectEqual(Solution().solveNQueens(3), [], "three")
    expectEqual(Solution().solveNQueens(5), [["Q....", "..Q..", "....Q", ".Q...", "...Q."], ["Q....", "...Q.", ".Q...", "....Q", "..Q.."], [".Q...", "...Q.", "Q....", "..Q..", "....Q"], [".Q...", "....Q", "..Q..", "Q....", "...Q."], ["..Q..", "Q....", "...Q.", ".Q...", "....Q"], ["..Q..", "....Q", ".Q...", "...Q.", "Q...."], ["...Q.", "Q....", "..Q..", "....Q", ".Q..."], ["...Q.", ".Q...", "....Q", "..Q..", "Q...."], ["....Q", ".Q...", "...Q.", "Q....", "..Q.."], ["....Q", "..Q..", "Q....", "...Q.", ".Q..."]], "five-count")
    // EXCLUDED_VECTOR zero: [0] | n is at least one.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
