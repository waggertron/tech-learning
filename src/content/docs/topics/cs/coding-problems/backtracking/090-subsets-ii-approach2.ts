function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function subsetsWithDup(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);               // L1: O(n log n) sort
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(start: number): void {
        result.push([...path]);               // L2: O(k) copy at every node
        for (let i = start; i < nums.length; i++) {
            if (i > start && nums[i] === nums[i - 1]) continue;  // L3: skip same-level dup
            path.push(nums[i]);               // L4: O(1) push
            backtrack(i + 1);                 // L5: recurse
            path.pop();                       // L6: O(1) pop
        }
    }

    backtrack(0);
    return result;
}

const norm = (arr: number[][]): string =>
    JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));

const r = subsetsWithDup([1, 2, 2]);
assert(norm(r) === norm([[], [1], [2], [1,2], [2,2], [1,2,2]]));
const r2 = subsetsWithDup([0]);
assert(norm(r2) === norm([[], [0]]));
const r3 = subsetsWithDup([2, 2, 2]);
assert(norm(r3) === norm([[], [2], [2,2], [2,2,2]]));
console.log('all tests pass');
