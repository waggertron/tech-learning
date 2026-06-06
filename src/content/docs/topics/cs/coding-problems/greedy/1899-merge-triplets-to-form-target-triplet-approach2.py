def merge_triplets(triplets: list[list[int]], target: list[int]) -> bool:
    hit = [False, False, False]
    for t in triplets:
        if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:
            continue
        for i in range(3):
            if t[i] == target[i]:
                hit[i] = True
    return all(hit)

assert merge_triplets([[2,5,3],[1,8,4],[1,7,5]], [2,7,5]) == True
assert merge_triplets([[1,3,4],[2,5,8]], [2,5,8]) == True
assert merge_triplets([[3,4,5]], [2,5,8]) == False
assert merge_triplets([[1,1,1]], [1,1,1]) == True
assert merge_triplets([[1,0,0],[0,1,0],[0,0,1]], [1,1,1]) == True
print("all tests pass")
