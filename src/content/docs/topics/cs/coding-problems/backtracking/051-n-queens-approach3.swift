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
        var result: [[String]] = [], columns = Set<Int>(), positive = Set<Int>(), negative = Set<Int>()
        func search(_ row: Int, _ placed: [Int]) { if row == n { result.append(placed.map { String(repeating: ".", count: $0) + "Q" + String(repeating: ".", count: n - $0 - 1) }); return }; for column in 0..<n where !columns.contains(column) && !positive.contains(row + column) && !negative.contains(row - column) { columns.insert(column); positive.insert(row + column); negative.insert(row - column); search(row + 1, placed + [column]); columns.remove(column); positive.remove(row + column); negative.remove(row - column) } }
        search(0, []); return result
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
