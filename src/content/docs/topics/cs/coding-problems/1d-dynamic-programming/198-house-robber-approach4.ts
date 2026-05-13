function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rob(nums: number[]): number {
    let prev2 = 0, prev1 = 0;
    for (const x of nums) {
        [prev2, prev1] = [prev1, Math.max(prev1, prev2 + x)];
    }
    return prev1;
}

assert(rob([1, 2, 3, 1]) === 4);
assert(rob([2, 7, 9, 3, 1]) === 12);
assert(rob([0]) === 0);
assert(rob([5]) === 5);
assert(rob([2, 1]) === 2);
assert(rob([1, 3, 1, 3, 100]) === 103);
console.log("all tests pass");
