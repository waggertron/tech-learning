function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function combinationSum2(candidates: number[], target: number): number[][] {
    candidates.sort((a, b) => a - b);           // L1: O(n log n) sort
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(start: number, remaining: number): void {
        if (remaining === 0) {
            result.push([...path]);              // L2: O(k) copy
            return;
        }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;                         // L3: O(1) prune
            if (i > start && candidates[i] === candidates[i - 1]) continue; // L4: skip same-level dup
            path.push(candidates[i]);                                     // L5: O(1) push
            backtrack(i + 1, remaining - candidates[i]);                  // L6: recurse (no reuse)
            path.pop();                                                   // L7: O(1) pop
        }
    }

    backtrack(0, target);
    return result;
}

const norm = (arr: number[][]): string =>
    JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));

const r = combinationSum2([10, 1, 2, 7, 6, 1, 5], 8);
assert(norm(r) === norm([[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]));
const r2 = combinationSum2([2, 5, 2, 1, 2], 5);
assert(norm(r2) === norm([[1, 2, 2], [5]]));
assert(combinationSum2([1, 2], 10).length === 0);
assert(norm(combinationSum2([3, 3], 3)) === norm([[3]]));
console.log('all tests pass');
