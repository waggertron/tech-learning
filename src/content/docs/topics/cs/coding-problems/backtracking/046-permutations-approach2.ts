function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    const n = nums.length;
    const used: boolean[] = new Array(n).fill(false);
    const path: number[] = [];

    function backtrack(): void {
        if (path.length === n) {
            result.push([...path]);      // L1: O(n) copy at leaf
            return;
        }
        for (let i = 0; i < n; i++) {
            if (used[i]) continue;       // L2: O(1) skip used
            used[i] = true;             // L3: O(1) mark used
            path.push(nums[i]);          // L4: O(1) push
            backtrack();                 // L5: recurse
            path.pop();                 // L6: O(1) pop
            used[i] = false;            // L7: O(1) unmark
        }
    }

    backtrack();
    return result;
}

const norm = (arr: number[][]): string =>
    JSON.stringify(arr.map(a => [...a]).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));

const r = permute([1, 2, 3]);
assert(r.length === 6);
assert(norm(r) === norm([[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]));
const r2 = permute([0, 1]);
assert(norm(r2) === norm([[0,1],[1,0]]));
assert(JSON.stringify(permute([1])) === JSON.stringify([[1]]));
console.log('all tests pass');
