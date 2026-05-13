function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function asteroidCollision(asteroids: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(asteroidCollision([5, 10, -5])) === JSON.stringify([5, 10]));
    assert(JSON.stringify(asteroidCollision([8, -8])) === JSON.stringify([]));
    assert(JSON.stringify(asteroidCollision([10, 2, -5])) === JSON.stringify([10]));
    assert(JSON.stringify(asteroidCollision([-2, -1, 1, 2])) === JSON.stringify([-2, -1, 1, 2]));
    console.log('all tests pass');
}

_runTests();
