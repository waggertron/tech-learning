function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canJump(nums: number[]): boolean {
    const n = nums.length;
    const dp: boolean[] = new Array(n).fill(false);
    dp[n - 1] = true;
    for (let i = n - 2; i >= 0; i--) {
        const furthest = Math.min(i + nums[i], n - 1);
        for (let j = i + 1; j <= furthest; j++) {
            if (dp[j]) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[0];
}

assert(canJump([2, 3, 1, 1, 4]) === true);
assert(canJump([3, 2, 1, 0, 4]) === false);
assert(canJump([0]) === true);
assert(canJump([1, 0]) === true);
assert(canJump([0, 1]) === false);
assert(canJump([2, 0, 0]) === true);
console.log("all tests pass");
