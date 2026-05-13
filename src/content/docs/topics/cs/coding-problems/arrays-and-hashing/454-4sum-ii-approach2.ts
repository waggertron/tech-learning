function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function fourSumCount(nums1: number[], nums2: number[], nums3: number[], nums4: number[]): number {
    const abCounts = new Map<number, number>();              // L1: O(1)
    for (const a of nums1) {                                // L2: outer loop, n iterations
        for (const b of nums2) {                            // L3: inner loop, n iterations
            const s = a + b;
            abCounts.set(s, (abCounts.get(s) ?? 0) + 1);  // L4: O(1) hash insert/update
        }
    }
    let result = 0;                                         // L5: O(1)
    for (const c of nums3) {                               // L6: outer loop, n iterations
        for (const d of nums4) {                           // L7: inner loop, n iterations
            result += abCounts.get(-(c + d)) ?? 0;        // L8: O(1) hash lookup
        }
    }
    return result;                                          // L9: O(1)
}

assert(fourSumCount([1,2], [-2,-1], [-1,2], [0,2]) === 2);
assert(fourSumCount([0], [0], [0], [0]) === 1);
assert(fourSumCount([-1,-1], [-1,1], [-1,1], [1,-1]) === 6);
console.log("all tests pass");
