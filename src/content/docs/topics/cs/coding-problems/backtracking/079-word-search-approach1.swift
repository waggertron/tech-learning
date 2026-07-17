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
    func exist(_ board: [[String]], _ word: String) -> Bool {
        let letters = Array(word); let rows = board.count, columns = board[0].count
        func search(_ row: Int, _ column: Int, _ index: Int, _ visited: Set<Int>) -> Bool { if index == letters.count { return true }; if row < 0 || row >= rows || column < 0 || column >= columns || board[row][column] != String(letters[index]) || visited.contains(row * columns + column) { return false }; var next = visited; next.insert(row * columns + column); return search(row + 1, column, index + 1, next) || search(row - 1, column, index + 1, next) || search(row, column + 1, index + 1, next) || search(row, column - 1, index + 1, next) }
        for row in 0..<rows { for column in 0..<columns where search(row, column, 0, []) { return true } }; return false
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:77ec7f1cae1ded19e7c67ff5f1c801c1d37a71eb6024045152810e450575f081
    expectEqual(Solution().exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"), true, "canonical-true")
    expectEqual(Solution().exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"), true, "second-true")
    expectEqual(Solution().exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"), false, "reuse-false")
    expectEqual(Solution().exist([["A"]], "A"), true, "single")
    expectEqual(Solution().exist([["A"]], "B"), false, "missing-single")
    // EXCLUDED_VECTOR empty-board: [[[]],"A"] | The board has at least one row and one column.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
