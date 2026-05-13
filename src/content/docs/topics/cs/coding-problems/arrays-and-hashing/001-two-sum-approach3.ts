function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement)!, i];
        seen.set(nums[i], i);
    }
    return [];
}

assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]));
assert(JSON.stringify(twoSum([3, 2, 4], 6)) === JSON.stringify([1, 2]));
assert(JSON.stringify(twoSum([3, 3], 6)) === JSON.stringify([0, 1]));
assert(JSON.stringify(twoSum([1, 2, 3, 4, 5], 9)) === JSON.stringify([3, 4]));
assert(JSON.stringify(twoSum([0, 4], 4)) === JSON.stringify([0, 1]));
console.log("all tests pass");
