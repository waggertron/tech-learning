from collections import Counter

def is_n_straight_hand(hand, group_size):
    if len(hand) % group_size != 0:
        return False
    counts = Counter(hand)
    for x in sorted(counts):
        c = counts[x]
        if c == 0:
            continue
        for k in range(group_size):
            if counts[x + k] < c:
                return False
            counts[x + k] -= c
    return True

assert is_n_straight_hand([1,2,3,6,2,3,4,7,8], 3) == True
assert is_n_straight_hand([1,2,3,4,5], 4) == False
assert is_n_straight_hand([1], 1) == True
assert is_n_straight_hand([1,2,3], 3) == True
assert is_n_straight_hand([1,2,4], 3) == False
assert is_n_straight_hand([1,1,2,2,3,3], 3) == True
print("all tests pass")
