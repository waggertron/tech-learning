function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function combinationSum(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(start: number, remaining: number): void {
        if (remaining === 0) {
            result.push([...path]);     // L1: O(k) copy at leaf
            return;
        }
        if (remaining < 0) return;
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);                       // L2: O(1) push
            backtrack(i, remaining - candidates[i]);        // L3: recurse (reuse allowed)
            path.pop();                                     // L4: O(1) pop
        }
    }

    backtrack(0, target);
    return result;
}

const norm = (arr: number[][]): string =>
    JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));

const r = combinationSum([2, 3, 6, 7], 7);
assert(norm(r) === norm([[2, 2, 3], [7]]));
const r2 = combinationSum([2, 3, 5], 8);
assert(norm(r2) === norm([[2, 2, 2, 2], [2, 3, 3], [3, 5]]));
assert(norm(combinationSum([3], 9)) === norm([[3, 3, 3]]));
assert(combinationSum([5], 3).length === 0);
console.log('all tests pass');
