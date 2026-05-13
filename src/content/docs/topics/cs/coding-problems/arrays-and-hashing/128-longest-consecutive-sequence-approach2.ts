function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestConsecutive(nums: number[]): number {
    if (nums.length === 0) return 0;                               // L1: O(1) guard
    const unique = [...new Set(nums)].sort((a, b) => a - b);     // L2: O(n log n) sort after O(n) dedup
    let best = 1, cur = 1;                                        // L3: O(1)
    for (let i = 1; i < unique.length; i++) {                    // L4: loop, n iterations
        if (unique[i] === unique[i - 1] + 1) {                   // L5: O(1) comparison
            cur++;
            best = Math.max(best, cur);                           // L7: O(1)
        } else {
            cur = 1;                                               // L8: O(1) reset
        }
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
