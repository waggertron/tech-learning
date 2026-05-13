function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestConsecutive(nums: number[]): number {
    const numSet = new Set(nums);                  // L1: O(n) set construction
    let best = 0;                                  // L2: O(1)
    for (const x of numSet) {                     // L3: outer loop, n iterations
        if (numSet.has(x - 1)) continue;          // L4: O(1) set lookup, skip non-starts
        let cur = x;                              // L5: O(1)
        let length = 1;                           // L6: O(1)
        while (numSet.has(cur + 1)) {             // L7: O(1) set lookup per call
            cur++;                                // L8: O(1)
            length++;                             // L9: O(1)
        }
        best = Math.max(best, length);            // L10: O(1)
    }
    return best;
}

assert(longestConsecutive([100, 4, 200, 1, 3, 2]) === 4);
assert(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) === 9);
assert(longestConsecutive([]) === 0);
assert(longestConsecutive([1]) === 1);
assert(longestConsecutive([1, 2, 3, 4, 5]) === 5);
assert(longestConsecutive([5, 4, 3, 2, 1]) === 5);
console.log("all tests pass");
