// LEETCODE_TYPE: Trie
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

private final class ArrayTrieNode {
    var children = Array<ArrayTrieNode?>(repeating: nil, count: 26)
    var isWord = false
}

final class Trie {
    private let root = ArrayTrieNode()
    init() {}
    func insert(_ word: String) {
        var node = root
        for character in word {
            guard let index = index(of: character) else { return }
            if node.children[index] == nil { node.children[index] = ArrayTrieNode() }
            guard let child = node.children[index] else { return }
            node = child
        }
        node.isWord = true
    }
    func search(_ word: String) -> Bool { node(for: word)?.isWord == true }
    func startsWith(_ prefix: String) -> Bool { node(for: prefix) != nil }
    private func node(for text: String) -> ArrayTrieNode? {
        var node = root
        for character in text {
            guard let index = index(of: character), let child = node.children[index] else { return nil }
            node = child
        }
        return node
    }
    private func index(of character: Character) -> Int? {
        guard let ascii = character.asciiValue, ascii >= 97, ascii <= 122 else { return nil }
        return Int(ascii - 97)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:f0689665308989048c3fdb0b558fe51e3d0bac21e009eb64dd58e8b72bc5d2a2
    let subject1 = Trie()
    subject1.insert("apple")
    expectEqual(subject1.search("apple"), true, "canonical-prefix-flow[2]")
    expectEqual(subject1.search("app"), false, "canonical-prefix-flow[3]")
    expectEqual(subject1.startsWith("app"), true, "canonical-prefix-flow[4]")
    subject1.insert("app")
    expectEqual(subject1.search("app"), true, "canonical-prefix-flow[6]")
    let subject2 = Trie()
    subject2.insert("apple")
    subject2.insert("application")
    expectEqual(subject2.search("apply"), false, "shared-prefixes[3]")
    expectEqual(subject2.startsWith("appli"), true, "shared-prefixes[4]")
    let subject3 = Trie()
    expectEqual(subject3.search("a"), false, "empty-trie[1]")
    expectEqual(subject3.startsWith("a"), false, "empty-trie[2]")
    // EXCLUDED_VECTOR empty-word: [[{"operation":"init","arguments":[]},{"operation":"insert","arguments":[""]}]] | Inserted words contain at least one lowercase letter.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
