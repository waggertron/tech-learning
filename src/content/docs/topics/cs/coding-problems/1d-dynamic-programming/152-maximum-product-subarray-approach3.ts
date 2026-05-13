function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProduct(nums: number[]): number {
    let maxHere = nums[0], minHere = nums[0], best = nums[0];
    for (let k = 1; k < nums.length; k++) {
        const x = nums[k];
        if (x < 0) [maxHere, minHere] = [minHere, maxHere];
        maxHere = Math.max(x, maxHere * x);
        minHere = Math.min(x, minHere * x);
        best = Math.max(best, maxHere);
    }
    return best;
}

assert(maxProduct([2, 3, -2, 4]) === 6);
assert(maxProduct([-2, 0, -1]) === 0);
assert(maxProduct([-2, 3, -4]) === 24);
assert(maxProduct([0]) === 0);
assert(maxProduct([-3]) === -3);
assert(maxProduct([-2, -3]) === 6);
console.log("all tests pass");
