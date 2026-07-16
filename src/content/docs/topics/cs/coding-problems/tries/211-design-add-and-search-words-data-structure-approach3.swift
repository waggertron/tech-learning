// LEETCODE_TYPE: WordDictionary
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

final class WordDictionary {
    private let root = TrieNode()
    init() {}
    func addWord(_ word: String) {
        var node = root
        for character in word {
            if node.children[character] == nil { node.children[character] = TrieNode() }
            guard let child = node.children[character] else { return }
            node = child
        }
        node.isWord = true
    }
    func search(_ word: String) -> Bool {
        let pattern = Array(word)
        func matches(_ index: Int, _ node: TrieNode) -> Bool {
            if index == pattern.count { return node.isWord }
            let character = pattern[index]
            if character == "." { return node.children.values.contains { matches(index + 1, $0) } }
            guard let child = node.children[character] else { return false }
            return matches(index + 1, child)
        }
        return matches(0, root)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:db11b5d00e55501fc5cb34e7007fc7a77ebd6f4904b28fae68bf161ee16091be
    let subject1 = WordDictionary()
    subject1.addWord("bad")
    subject1.addWord("dad")
    subject1.addWord("mad")
    expectEqual(subject1.search("pad"), false, "canonical-wildcards[4]")
    expectEqual(subject1.search("bad"), true, "canonical-wildcards[5]")
    expectEqual(subject1.search(".ad"), true, "canonical-wildcards[6]")
    expectEqual(subject1.search("b.."), true, "canonical-wildcards[7]")
    let subject2 = WordDictionary()
    subject2.addWord("at")
    subject2.addWord("atom")
    expectEqual(subject2.search("a."), true, "length-matters[3]")
    expectEqual(subject2.search("a.."), false, "length-matters[4]")
    expectEqual(subject2.search("...."), true, "length-matters[5]")
    let subject3 = WordDictionary()
    expectEqual(subject3.search("."), false, "empty-dictionary[1]")
    // EXCLUDED_VECTOR unsupported-pattern-character: [[{"operation":"init","arguments":[]},{"operation":"search","arguments":["a*"]}]] | Search patterns contain lowercase letters and dots only.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
