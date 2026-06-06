from __future__ import annotations

class TrieNode:
    __slots__ = ("children", "is_end")
    def __init__(self) -> None:
        self.children: list[TrieNode | None] = [None] * 26
        self.is_end = False

class Trie:
    def __init__(self) -> None:
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            i = ord(ch) - ord('a')
            if node.children[i] is None:
                node.children[i] = TrieNode()
            node = node.children[i]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def _walk(self, s: str) -> TrieNode | None:
        node = self.root
        for ch in s:
            i = ord(ch) - ord('a')
            if node.children[i] is None:
                return None
            node = node.children[i]
        return node

trie = Trie()
trie.insert("apple")
assert trie.search("apple") == True
assert trie.search("app") == False
assert trie.startsWith("app") == True
trie.insert("app")
assert trie.search("app") == True
assert trie.search("ap") == False
assert trie.startsWith("b") == False
print("all tests pass")
