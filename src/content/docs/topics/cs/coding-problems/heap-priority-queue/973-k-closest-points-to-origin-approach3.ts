function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function kClosest(points: number[][], k: number): number[][] {
    const arr = points.map(p => [...p]); // avoid mutating input

    const dist = (p: number[]) => p[0] * p[0] + p[1] * p[1];

    function partition(lo: number, hi: number): number {  // L1: O(hi - lo) per call
        const pivot = dist(arr[hi]);
        let store = lo;
        for (let i = lo; i < hi; i++) {
            if (dist(arr[i]) <= pivot) {
                [arr[store], arr[i]] = [arr[i], arr[store]];
                store++;
            }
        }
        [arr[store], arr[hi]] = [arr[hi], arr[store]];
        return store;
    }

    function quickselect(lo: number, hi: number, k: number): void {
        if (lo >= hi) return;                       // L2: base case
        const p = partition(lo, hi);               // L3: O(subarray size)
        if (p === k) return;
        if (p < k) quickselect(p + 1, hi, k);     // L4: recurse right
        else quickselect(lo, p - 1, k);            // L5: recurse left
    }

    quickselect(0, arr.length - 1, k);
    return arr.slice(0, k);
}

const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];

let result = kClosest([[1, 3], [-2, 2]], 1);
assert(JSON.stringify(result.slice().sort(sortFn)) === JSON.stringify([[-2, 2]].sort(sortFn)), `got ${JSON.stringify(result)}`);

result = kClosest([[3, 3], [5, -1], [-2, 4]], 2);
assert(
    JSON.stringify(result.slice().sort(sortFn)) === JSON.stringify([[3, 3], [-2, 4]].sort(sortFn)),
    `got ${JSON.stringify(result)}`
);

assert(JSON.stringify(kClosest([[0, 0]], 1)) === JSON.stringify([[0, 0]]));

result = kClosest([[1, 0], [-1, 0], [0, 1], [0, -1]], 2);
assert(result.length === 2);

result = kClosest([[1, 2], [3, 4], [0, 0]], 3);
assert(result.length === 3);

console.log("all tests pass");
