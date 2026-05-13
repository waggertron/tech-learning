def multiply(num1, num2):
    if num1 == "0" or num2 == "0":              # L1: O(1) early exit
        return "0"
    n, m = len(num1), len(num2)                 # L2: O(1)
    result = [0] * (n + m)                      # L3: O(n + m)
    for i in range(n - 1, -1, -1):              # L4: outer loop, n iterations
        for j in range(m - 1, -1, -1):          # L5: inner loop, m iterations
            prod = int(num1[i]) * int(num2[j])  # L6: O(1)
            p1, p2 = i + j, i + j + 1          # L7: O(1)
            total = prod + result[p2]           # L8: O(1)
            result[p2] = total % 10             # L9: O(1)
            result[p1] += total // 10           # L10: O(1)
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1                              # L11: O(n + m)
    return "".join(map(str, result[start:]))    # L12: O(n + m)

assert multiply("2", "3") == "6"
assert multiply("123", "456") == "56088"
assert multiply("0", "12345") == "0"
assert multiply("99", "99") == "9801"
assert multiply("1", "1") == "1"
assert multiply("9999", "9999") == "99980001"
print("all tests pass")
