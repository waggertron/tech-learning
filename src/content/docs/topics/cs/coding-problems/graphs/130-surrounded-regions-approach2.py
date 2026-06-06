def solve(board: list[list[str]]) -> None:
    if not board:
        return
    rows, cols = len(board), len(board[0])

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != 'O':
            return
        board[r][c] = 'T'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    for c in range(cols):
        dfs(0, c); dfs(rows - 1, c)
    for r in range(rows):
        dfs(r, 0); dfs(r, cols - 1)

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'T':
                board[r][c] = 'O'

b = [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']]
solve(b)
assert b == [['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]
b2 = [['X','X'],['X','X']]
solve(b2)
assert b2 == [['X','X'],['X','X']]
b3 = [['O']]
solve(b3)
assert b3 == [['O']]
b4 = [['O','O','O'],['O','X','O'],['O','O','O']]
solve(b4)
assert b4 == [['O','O','O'],['O','X','O'],['O','O','O']]
b5 = [['X','X','X'],['X','O','X'],['X','X','X']]
solve(b5)
assert b5 == [['X','X','X'],['X','X','X'],['X','X','X']]
print("all tests pass")
