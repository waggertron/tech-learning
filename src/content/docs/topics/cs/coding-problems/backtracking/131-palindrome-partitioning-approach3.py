def partition(s: str) -> list[list[str]]:
    n = len(s)
    # is_pal[i][j] = True iff s[i:j+1] is a palindrome
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True                        # L1: single chars are palindromes
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and (length == 2 or is_pal[i + 1][j - 1]):
                is_pal[i][j] = True                # L2: O(1) DP recurrence

    result = []
    path = []

    def backtrack(start: int) -> None:
        if start == n:
            result.append(path[:])                 # L3: O(n) copy
            return
        for end in range(start, n):
            if is_pal[start][end]:                 # L4: O(1) table lookup
                path.append(s[start:end + 1])      # L5: O(k) slice for result
                backtrack(end + 1)                 # L6: recurse
                path.pop()

    backtrack(0)
    return result

r = partition("aab")
assert sorted(map(tuple, r)) == sorted([("a","a","b"), ("aa","b")])
assert partition("a") == [["a"]]
r3 = partition("aaa")
assert sorted(map(tuple, r3)) == sorted([("a","a","a"), ("a","aa"), ("aa","a"), ("aaa",)])
r4 = partition("abc")
assert sorted(map(tuple, r4)) == sorted([("a","b","c")])
print("all tests pass")
