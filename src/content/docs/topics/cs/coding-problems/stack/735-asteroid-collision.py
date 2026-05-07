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
