from functools import lru_cache

def num_decodings(s):
    @lru_cache(maxsize=None)
    def f(i):
        if i == len(s):
            return 1
        if s[i] == '0':
            return 0
        ways = f(i + 1)
        if i + 1 < len(s) and 10 <= int(s[i:i + 2]) <= 26:
            ways += f(i + 2)
        return ways
    return f(0)

assert num_decodings('12') == 2
assert num_decodings('226') == 3
assert num_decodings('06') == 0
assert num_decodings('0') == 0
assert num_decodings('1') == 1
assert num_decodings('11106') == 2
print("all tests pass")
