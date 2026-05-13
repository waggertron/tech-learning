def is_happy(n):
    def next_n(x):
        total = 0
        while x:                        # L1: O(log x) digit extraction
            total += (x % 10) ** 2
            x //= 10
        return total

    slow = fast = n
    while True:
        slow = next_n(slow)             # L2: one step
        fast = next_n(next_n(fast))     # L3: two steps
        if fast == 1:
            return True                 # L4: happy
        if slow == fast:
            return False                # L5: cycle detected

assert is_happy(19) == True
assert is_happy(2) == False
assert is_happy(1) == True
assert is_happy(7) == True
assert is_happy(4) == False
assert is_happy(100) == True
print("all tests pass")
