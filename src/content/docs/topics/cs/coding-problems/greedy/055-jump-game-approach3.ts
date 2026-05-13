function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canJump(nums: number[]): boolean {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    return true;
}

assert(canJump([2, 3, 1, 1, 4]) === true);
assert(canJump([3, 2, 1, 0, 4]) === false);
assert(canJump([0]) === true);
assert(canJump([1, 0]) === true);
assert(canJump([0, 1]) === false);
assert(canJump([2, 0, 0]) === true);
console.log("all tests pass");
