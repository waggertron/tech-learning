function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function subsets(nums: number[]): number[][] {
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(i: number): void {
        if (i === nums.length) {
            result.push([...path]);    // L1: O(n) copy at leaf
            return;
        }
        // exclude
        backtrack(i + 1);             // L2: recurse without nums[i]
        // include
        path.push(nums[i]);           // L3: O(1) push
        backtrack(i + 1);             // L4: recurse with nums[i]
        path.pop();                   // L5: O(1) pop
    }

    backtrack(0);
    return result;
}

const norm = (arr: number[][]): string =>
    JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));

const r = subsets([1, 2, 3]);
assert(r.length === 8);
assert(norm(r) === norm([[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]));
const r2 = subsets([0]);
assert(norm(r2) === norm([[], [0]]));
assert(JSON.stringify(subsets([])) === JSON.stringify([[]]));
console.log('all tests pass');
