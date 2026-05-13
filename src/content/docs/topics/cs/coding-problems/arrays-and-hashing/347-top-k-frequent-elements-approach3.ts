function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function topKFrequent(nums: number[], k: number): number[] {
    const counts = new Map<number, number>();
    for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);  // L1: O(n)
    const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []); // L2: O(n)
    for (const [num, cnt] of counts) buckets[cnt].push(num);         // L3/L4: O(d)
    const result: number[] = [];
    for (let cnt = buckets.length - 1; cnt > 0; cnt--) {            // L5: scan high to low
        for (const num of buckets[cnt]) {
            result.push(num);                                         // L7: O(1)
            if (result.length === k) return result;                   // L8: early return
        }
    }
    return result;
}

assert(JSON.stringify([...topKFrequent([1, 1, 1, 2, 2, 3], 2)].sort((a, b) => a - b)) === JSON.stringify([1, 2]));
assert(JSON.stringify(topKFrequent([1], 1)) === JSON.stringify([1]));
assert(JSON.stringify([...topKFrequent([1, 2], 2)].sort((a, b) => a - b)) === JSON.stringify([1, 2]));
const r = topKFrequent([1, 2, 3], 1);
assert(r.length === 1 && [1, 2, 3].includes(r[0]));
console.log("all tests pass");
