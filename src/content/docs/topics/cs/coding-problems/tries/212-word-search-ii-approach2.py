from __future__ import annotations

class TrieNode:
    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.word: str | None = None

def find_words(board: list[list[str]], words: list[str]) -> list[str]:
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.word = w

    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r, c, node):
        if not (0 <= r < rows and 0 <= c < cols):
            return
        ch = board[r][c]
        if ch == "#" or ch not in node.children:
            return
        next_node = node.children[ch]
        if next_node.word:
            found.append(next_node.word)
            next_node.word = None
        board[r][c] = "#"
        dfs(r + 1, c, next_node); dfs(r - 1, c, next_node)
        dfs(r, c + 1, next_node); dfs(r, c - 1, next_node)
        board[r][c] = ch

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return found

board1 = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
assert set(find_words(board1, ["oath","pea","eat","rain"])) == {"oath","eat"}
assert find_words([["a"]], ["a"]) == ["a"]
assert find_words([["a"]], ["b"]) == []
board2 = [["a","b"],["c","d"]]
assert set(find_words(board2, ["ab","cd","abdc"])) == {"ab","cd","abdc"}
print("all tests pass")
