function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canJump(nums: number[]): boolean {
    const n = nums.length;
    const memo: Array<boolean | undefined> = new Array(n);
    memo[n - 1] = true;

    function good(i: number): boolean {
        if (i >= n - 1) return true;
        if (memo[i] !== undefined) return memo[i];

        const furthest = Math.min(i + nums[i], n - 1);
        for (let j = furthest; j > i; j--) {
            if (good(j)) {
                memo[i] = true;
                return true;
            }
        }
        memo[i] = false;
        return false;
    }

    return good(0);
}

assert(canJump([2, 3, 1, 1, 4]) === true);
assert(canJump([3, 2, 1, 0, 4]) === false);
assert(canJump([0]) === true);
assert(canJump([1, 0]) === true);
assert(canJump([0, 1]) === false);
assert(canJump([2, 0, 0]) === true);
console.log("all tests pass");
