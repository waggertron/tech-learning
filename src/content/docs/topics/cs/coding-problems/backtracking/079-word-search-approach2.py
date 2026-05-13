def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, i):
        if i == len(word):
            return True                               # L1: full match
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
            return False                              # L2: boundary / mismatch
        saved = board[r][c]
        board[r][c] = '#'                             # L3: O(1) mark in-place
        found = (dfs(r + 1, c, i + 1) or
                 dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or
                 dfs(r, c - 1, i + 1))               # L4: 4 recursive calls
        board[r][c] = saved                           # L5: O(1) restore
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False

board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]
import copy
assert exist(copy.deepcopy(board), 'ABCCED') == True
assert exist(copy.deepcopy(board), 'SEE') == True
assert exist(copy.deepcopy(board), 'ABCB') == False
assert exist([['A']], 'A') == True
assert exist([['A']], 'B') == False
print("all tests pass")
