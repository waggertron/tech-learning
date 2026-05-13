def jump(nums):
    n = len(nums)
    if n <= 1:
        return 0
    visited = [False] * n
    visited[0] = True
    level = 0
    frontier = [0]
    while frontier:
        level += 1
        next_frontier = []
        for i in frontier:
            for k in range(1, nums[i] + 1):
                j = i + k
                if j >= n - 1:
                    return level
                if not visited[j]:
                    visited[j] = True
                    next_frontier.append(j)
        frontier = next_frontier
    return -1

assert jump([2, 3, 1, 1, 4]) == 2
assert jump([2, 3, 0, 1, 4]) == 2
assert jump([1]) == 0
assert jump([1, 1, 1, 1]) == 3
assert jump([5, 4, 3, 2, 1, 0]) == 1
print("all tests pass")
