def partition(s):
    result = []
    path = []
    n = len(s)

    def is_pal(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1                      # L1: O(k) two-pointer check
        return True

    def backtrack(start):
        if start == n:
            result.append(path[:])      # L2: O(n) copy
            return
        for end in range(start, n):
            if is_pal(start, end):
                path.append(s[start:end + 1])  # L3: O(k) slice for result
                backtrack(end + 1)             # L4: recurse
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
