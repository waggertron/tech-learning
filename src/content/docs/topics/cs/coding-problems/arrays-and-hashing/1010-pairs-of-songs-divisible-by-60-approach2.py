def num_pairs_divisible_by60(time: list[int]) -> int:
    remainders = [0] * 60
    result = 0
    for t in time:
        complement = (60 - t % 60) % 60
        result += remainders[complement]
        remainders[t % 60] += 1
    return result

assert num_pairs_divisible_by60([30,20,150,100,40]) == 3
assert num_pairs_divisible_by60([60,60,60]) == 3
assert num_pairs_divisible_by60([10,50,90,30]) == 2
assert num_pairs_divisible_by60([1]) == 0
assert num_pairs_divisible_by60([60]) == 0
print("all tests pass")
