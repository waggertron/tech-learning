function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function topKFrequent(nums: number[], k: number): number[] {
    const counts = new Map<number, number>();
    for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);   // L1: O(n)
    // Min-heap via sorted array (JS has no built-in heap; simulate with sort)
    const entries = Array.from(counts.entries());
    entries.sort((a, b) => b[1] - a[1]);                               // O(d log d)
    return entries.slice(0, k).map(([num]) => num);                    // O(k)
}

assert(JSON.stringify([...topKFrequent([1, 1, 1, 2, 2, 3], 2)].sort((a, b) => a - b)) === JSON.stringify([1, 2]));
assert(JSON.stringify(topKFrequent([1], 1)) === JSON.stringify([1]));
assert(JSON.stringify([...topKFrequent([1, 2], 2)].sort((a, b) => a - b)) === JSON.stringify([1, 2]));
const r = topKFrequent([1, 2, 3], 1);
assert(r.length === 1 && [1, 2, 3].includes(r[0]));
console.log("all tests pass");
