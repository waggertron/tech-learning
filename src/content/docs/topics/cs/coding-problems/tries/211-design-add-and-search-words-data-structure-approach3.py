from __future__ import annotations

class TrieNode:
    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.is_end = False

class WordDictionary:
    def __init__(self) -> None:
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        def dfs(i, node):
            if i == len(word):
                return node.is_end
            ch = word[i]
            if ch == '.':
                return any(dfs(i + 1, child) for child in node.children.values())
            if ch in node.children:
                return dfs(i + 1, node.children[ch])
            return False
        return dfs(0, self.root)

wd = WordDictionary()
wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad")
assert wd.search("pad") == False
assert wd.search("bad") == True
assert wd.search(".ad") == True
assert wd.search("b..") == True
assert wd.search("...") == True
assert wd.search("....") == False
print("all tests pass")
