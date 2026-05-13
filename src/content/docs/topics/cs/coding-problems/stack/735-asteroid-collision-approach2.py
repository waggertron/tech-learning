def asteroid_collision(asteroids: list[int]) -> list[int]:
    stack = []

    for asteroid in asteroids:
        alive = True

        while alive and stack and asteroid < 0 < stack[-1]:
            if stack[-1] < -asteroid:
                stack.pop()
            elif stack[-1] == -asteroid:
                stack.pop()
                alive = False
            else:
                alive = False

        if alive:
            stack.append(asteroid)

    return stack

assert asteroid_collision([5, 10, -5]) == [5, 10]
assert asteroid_collision([8, -8]) == []
assert asteroid_collision([10, 2, -5]) == [10]
assert asteroid_collision([-2, -1, 1, 2]) == [-2, -1, 1, 2]
print("all tests pass")
