function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    const arr = [...nums];

    function backtrack(start: number): void {
        if (start === arr.length) {
            result.push([...arr]);              // L1: O(n) copy
            return;
        }
        for (let i = start; i < arr.length; i++) {
            [arr[start], arr[i]] = [arr[i], arr[start]];  // L2: O(1) swap
            backtrack(start + 1);                          // L3: recurse
            [arr[start], arr[i]] = [arr[i], arr[start]];  // L4: O(1) undo swap
        }
    }

    backtrack(0);
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
