function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function combinationSum(candidates: number[], target: number): number[][] {
    candidates.sort((a, b) => a - b);   // L1: O(n log n) sort once
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(start: number, remaining: number): void {
        if (remaining === 0) {
            result.push([...path]);     // L2: O(k) copy at leaf
            return;
        }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;    // L3: O(1) prune entire suffix
            path.push(candidates[i]);                // L4: O(1) push
            backtrack(i, remaining - candidates[i]); // L5: recurse
            path.pop();                              // L6: O(1) pop
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
