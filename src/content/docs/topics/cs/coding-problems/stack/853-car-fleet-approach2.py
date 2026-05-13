def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    cars = sorted(zip(position, speed), reverse=True)
    fleets = 0
    last_arrival = 0.0
    for pos, spd in cars:
        arrival = (target - pos) / spd
        if arrival > last_arrival:
            fleets += 1
            last_arrival = arrival
    return fleets

assert car_fleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) == 3
assert car_fleet(10, [3], [3]) == 1
assert car_fleet(100, [0, 2, 4], [4, 2, 1]) == 1
assert car_fleet(10, [6, 8], [3, 2]) == 2
print("all tests pass")
