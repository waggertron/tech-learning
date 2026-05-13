from collections import Counter

def least_interval(tasks, n):
    counts = Counter(tasks)                              # L1: O(T) build counter
    max_count = max(counts.values())                     # L2: O(t) find max
    ties = sum(1 for c in counts.values() if c == max_count)  # L3: O(t) count ties
    return max(len(tasks), (max_count - 1) * (n + 1) + ties)  # L4: O(1) formula

assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 2) == 8
assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 0) == 6
assert least_interval(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2) == 16
assert least_interval(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'], 2) == 8
assert least_interval(['A', 'A', 'A'], 3) == 9
assert least_interval(['A', 'A', 'A'], 0) == 3
print("all tests pass")
