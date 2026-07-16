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

// SWIFT_CATALOG_HELPER: TrieNode
final class TrieNode {
    var children: [Character: TrieNode]
    var isWord: Bool

    init(children: [Character: TrieNode] = [:], isWord: Bool = false) {
        self.children = children
        self.isWord = isWord
    }
}

final class Solution {
    func findWords(_ board: [[Character]], _ words: [String]) -> [String] {
        guard !board.isEmpty, !board[0].isEmpty else { return [] }
        return words.filter { exists($0, in: board) }
    }
    private func exists(_ word: String, in board: [[Character]]) -> Bool {
        let target = Array(word)
        var visited = Array(repeating: Array(repeating: false, count: board[0].count), count: board.count)
        func search(_ row: Int, _ column: Int, _ index: Int) -> Bool {
            guard row >= 0, row < board.count, column >= 0, column < board[0].count,
                  !visited[row][column], board[row][column] == target[index] else { return false }
            if index == target.count - 1 { return true }
            visited[row][column] = true
            defer { visited[row][column] = false }
            return search(row + 1, column, index + 1) || search(row - 1, column, index + 1)
                || search(row, column + 1, index + 1) || search(row, column - 1, index + 1)
        }
        for row in board.indices {
            for column in board[row].indices where search(row, column, 0) { return true }
        }
        return false
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:f9aa2cbd8f8141cca47051190a792d884e6efe0dd199da1634c68c996c3f5ca1
    expectEqual(Solution().findWords([["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"]), ["oath", "eat"], "canonical-board")
    expectEqual(Solution().findWords([["a", "b"], ["c", "d"]], ["ab", "ac", "abd", "abcd", "bd"]), ["ab", "ac", "abd", "bd"], "overlapping-paths")
    expectEqual(Solution().findWords([["a", "b"], ["c", "d"]], ["xyz", "aaa"]), [], "no-word-found")
    expectEqual(Solution().findWords([["a"]], ["a", "b"]), ["a"], "single-cell")
    // EXCLUDED_VECTOR ragged-board: [[["a","b"],["c"]],["ab"]] | Every board row must have the same number of cells.
    // EXCLUDED_VECTOR empty-word-list: [[["a"]],[]] | The word list must contain at least one word.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
