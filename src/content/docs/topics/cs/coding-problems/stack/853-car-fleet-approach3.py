def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    cars = sorted(zip(position, speed), reverse=True)
    stack = []
    for pos, spd in cars:
        t = (target - pos) / spd
        if not stack or t > stack[-1]:
            stack.append(t)
    return len(stack)

assert car_fleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) == 3
assert car_fleet(10, [3], [3]) == 1
assert car_fleet(100, [0, 2, 4], [4, 2, 1]) == 1
assert car_fleet(10, [6, 8], [3, 2]) == 2
print("all tests pass")
