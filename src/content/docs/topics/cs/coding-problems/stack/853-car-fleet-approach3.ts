function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function carFleet(target: number, position: number[], speed: number[]): number {
    const cars = position.map((p, i) => [p, speed[i]] as [number, number]);
    cars.sort((a, b) => b[0] - a[0]);
    const stack: number[] = [];
    for (const [pos, spd] of cars) {
        const t = (target - pos) / spd;
        if (!stack.length || t > stack[stack.length - 1])
            stack.push(t);
    }
    return stack.length;
}

assert(carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) === 3);
assert(carFleet(10, [3], [3]) === 1);
assert(carFleet(100, [0, 2, 4], [4, 2, 1]) === 1);
assert(carFleet(10, [6, 8], [3, 2]) === 2);
console.log('all tests pass');
