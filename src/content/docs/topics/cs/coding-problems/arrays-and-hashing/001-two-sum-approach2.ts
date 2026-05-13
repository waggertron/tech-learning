function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function twoSum(nums: number[], target: number): number[] {
    const indexed = nums.map((v, i) => [i, v] as [number, number]);
    indexed.sort((a, b) => a[1] - b[1]);
    let l = 0, r = indexed.length - 1;
    while (l < r) {
        const s = indexed[l][1] + indexed[r][1];
        if (s === target) {
            return [indexed[l][0], indexed[r][0]].sort((a, b) => a - b);
        }
        if (s < target) l++;
        else r--;
    }
    return [];
}

assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]));
assert(JSON.stringify(twoSum([3, 2, 4], 6)) === JSON.stringify([1, 2]));
assert(JSON.stringify(twoSum([3, 3], 6)) === JSON.stringify([0, 1]));
assert(JSON.stringify(twoSum([1, 2, 3, 4, 5], 9)) === JSON.stringify([3, 4]));
assert(JSON.stringify(twoSum([0, 4], 4)) === JSON.stringify([0, 1]));
console.log("all tests pass");
