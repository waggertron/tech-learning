function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function bisectLeft(arr: number[], x: number): number {
    let lo = 0, hi = arr.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (arr[mid] < x) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

function lengthOfLIS(nums: number[]): number {
    const tails: number[] = [];
    for (const x of nums) {
        const i = bisectLeft(tails, x);
        if (i === tails.length) tails.push(x);
        else tails[i] = x;
    }
    return tails.length;
}

assert(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]) === 4);
assert(lengthOfLIS([0, 1, 0, 3, 2, 3]) === 4);
assert(lengthOfLIS([7, 7, 7, 7]) === 1);
assert(lengthOfLIS([1]) === 1);
assert(lengthOfLIS([1, 2, 3, 4, 5]) === 5);
assert(lengthOfLIS([5, 4, 3, 2, 1]) === 1);
console.log("all tests pass");
