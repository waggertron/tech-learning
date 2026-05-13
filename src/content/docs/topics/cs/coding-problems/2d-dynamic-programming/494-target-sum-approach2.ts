function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findTargetSumWays(nums: number[], target: number): number {
    const memo: Map<string, number> = new Map();
    function f(i: number, cur: number): number {
        if (i === nums.length) return cur === target ? 1 : 0;
        const key = `${i},${cur}`;
        if (memo.has(key)) return memo.get(key)!;
        const result = f(i + 1, cur + nums[i]) + f(i + 1, cur - nums[i]);
        memo.set(key, result);
        return result;
    }
    return f(0, 0);
}

assert(findTargetSumWays([1, 1, 1, 1, 1], 3) === 5);
assert(findTargetSumWays([1], 1) === 1);
assert(findTargetSumWays([1, 1], 0) === 2);
assert(findTargetSumWays([1, 2], 4) === 0);
assert(findTargetSumWays([1], -1) === 1);
assert(findTargetSumWays([0, 0, 0], 0) === 8);
console.log("all tests pass");
