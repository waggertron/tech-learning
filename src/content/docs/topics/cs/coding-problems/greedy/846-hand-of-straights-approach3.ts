function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap using a sorted array for simplicity (small enough for interview context)
function isNStraightHandHeap(hand: number[], groupSize: number): boolean {
    if (hand.length % groupSize !== 0) return false;
    const counts = new Map<number, number>();
    for (const v of hand) counts.set(v, (counts.get(v) ?? 0) + 1);
    // Use sorted keys as a proxy for min-heap; re-sort after mutations would be O(u log u)
    // Here we use a simple sorted key list and skip exhausted entries
    const keys = Array.from(counts.keys()).sort((a, b) => a - b);
    let ki = 0;
    while (ki < keys.length) {
        const x = keys[ki];
        if ((counts.get(x) ?? 0) === 0) { ki++; continue; }
        for (let k = 0; k < groupSize; k++) {
            const cur = counts.get(x + k) ?? 0;
            if (cur === 0) return false;
            counts.set(x + k, cur - 1);
        }
    }
    return true;
}

assert(isNStraightHandHeap([1,2,3,6,2,3,4,7,8], 3) === true);
assert(isNStraightHandHeap([1,2,3,4,5], 4) === false);
assert(isNStraightHandHeap([1], 1) === true);
assert(isNStraightHandHeap([1,2,3], 3) === true);
assert(isNStraightHandHeap([1,2,4], 3) === false);
assert(isNStraightHandHeap([1,1,2,2,3,3], 3) === true);
console.log("all tests pass");
