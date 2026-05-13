function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function asteroidCollision(asteroids: number[]): number[] {
    const stack: number[] = [];

    for (const asteroid of asteroids) {
        let alive = true;

        while (alive && stack.length && asteroid < 0 && stack[stack.length - 1] > 0) {
            const top = stack[stack.length - 1];
            if (top < -asteroid) {
                stack.pop();
            } else if (top === -asteroid) {
                stack.pop();
                alive = false;
            } else {
                alive = false;
            }
        }

        if (alive) stack.push(asteroid);
    }

    return stack;
}

assert(JSON.stringify(asteroidCollision([5, 10, -5])) === JSON.stringify([5, 10]));
assert(JSON.stringify(asteroidCollision([8, -8])) === JSON.stringify([]));
assert(JSON.stringify(asteroidCollision([10, 2, -5])) === JSON.stringify([10]));
assert(JSON.stringify(asteroidCollision([-2, -1, 1, 2])) === JSON.stringify([-2, -1, 1, 2]));
console.log('all tests pass');
