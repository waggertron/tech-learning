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
        // TODO: Implement
        fatalError("TODO: Implement")
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
