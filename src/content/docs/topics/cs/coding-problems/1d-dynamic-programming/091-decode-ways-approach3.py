def num_decodings(s):
    if not s or s[0] == '0':
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        cur = 0
        if s[i] != '0':
            cur += prev1
        two = int(s[i - 1:i + 1])
        if 10 <= two <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1

assert num_decodings('12') == 2
assert num_decodings('226') == 3
assert num_decodings('06') == 0
assert num_decodings('0') == 0
assert num_decodings('1') == 1
assert num_decodings('11106') == 2
print("all tests pass")
