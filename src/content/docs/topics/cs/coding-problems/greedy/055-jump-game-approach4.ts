function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canJump(nums: number[]): boolean {
    let leftmostGood = nums.length - 1;

    for (let i = nums.length - 2; i >= 0; i--) {
        if (i + nums[i] >= leftmostGood) {
            leftmostGood = i;
        }
    }

    return leftmostGood === 0;
}

assert(canJump([2, 3, 1, 1, 4]) === true);
assert(canJump([3, 2, 1, 0, 4]) === false);
assert(canJump([0]) === true);
assert(canJump([1, 0]) === true);
assert(canJump([0, 1]) === false);
assert(canJump([2, 0, 0]) === true);
console.log("all tests pass");
