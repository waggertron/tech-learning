def solve_n_queens(n: int) -> list[list[str]]:
    result = []
    cols_used = set()
    diag1 = set()   # row + col
    diag2 = set()   # row - col
    placement = [-1] * n

    def backtrack(r: int) -> None:
        if r == n:
            board = ["".join("Q" if placement[i] == j else "." for j in range(n)) for i in range(n)]
            result.append(board)                      # L1: O(n^2) build board
            return
        for c in range(n):
            if c in cols_used or (r + c) in diag1 or (r - c) in diag2:
                continue                              # L2: O(1) conflict check
            cols_used.add(c)                          # L3: O(1) mark column
            diag1.add(r + c)                          # L4: O(1) mark anti-diag
            diag2.add(r - c)                          # L5: O(1) mark main diag
            placement[r] = c
            backtrack(r + 1)                          # L6: recurse to next row
            cols_used.remove(c)                       # L7: O(1) unmark
            diag1.remove(r + c)
            diag2.remove(r - c)

    backtrack(0)
    return result

assert solve_n_queens(1) == [["Q"]]
r4 = solve_n_queens(4)
assert len(r4) == 2
assert sorted(r4) == sorted([[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]])
assert len(solve_n_queens(5)) == 10
assert solve_n_queens(2) == []
assert solve_n_queens(3) == []
print("all tests pass")
