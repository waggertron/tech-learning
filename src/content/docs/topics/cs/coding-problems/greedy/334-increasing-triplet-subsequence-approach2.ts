function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function increasingTriplet(nums: number[]): boolean {
    const n = nums.length;
    if (n < 3) return false;
    const minLeft: number[] = new Array(n);
    const maxRight: number[] = new Array(n);
    minLeft[0] = nums[0];
    for (let i = 1; i < n; i++)
        minLeft[i] = Math.min(minLeft[i - 1], nums[i]);
    maxRight[n - 1] = nums[n - 1];
    for (let i = n - 2; i >= 0; i--)
        maxRight[i] = Math.max(maxRight[i + 1], nums[i]);
    for (let j = 1; j < n - 1; j++)
        if (minLeft[j - 1] < nums[j] && nums[j] < maxRight[j + 1])
            return true;
    return false;
}

assert(increasingTriplet([1, 2, 3, 4, 5]) === true);
assert(increasingTriplet([5, 4, 3, 2, 1]) === false);
assert(increasingTriplet([2, 1, 5, 0, 4, 6]) === true);
assert(increasingTriplet([1, 2]) === false);
assert(increasingTriplet([1, 1, 1, 1, 1]) === false);
assert(increasingTriplet([20, 100, 10, 12, 5, 13]) === true);
console.log('all tests pass');
