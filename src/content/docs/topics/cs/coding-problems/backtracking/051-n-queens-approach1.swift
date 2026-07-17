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
        func build(_ columns: [Int]) -> [String] { columns.map { column in String(repeating: ".", count: column) + "Q" + String(repeating: ".", count: n - column - 1) } }
        func enumerate(_ rows: [Int]) { if rows.count == n { for row in 0..<n { for other in (row + 1)..<n { if rows[row] == rows[other] || abs(rows[row] - rows[other]) == other - row { return } } }; result.append(build(rows)); return }; for column in 0..<n { enumerate(rows + [column]) } }
        enumerate([]); return result
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
