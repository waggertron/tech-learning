function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);                    // L1: O(n log n)
    const n = nums.length;                         // L2: O(1)
    const result: number[][] = [];                 // L3: O(1)
    for (let i = 0; i < n - 2; i++) {             // L4: outer loop, n-2 iters
        if (i > 0 && nums[i] === nums[i - 1]) continue; // L5: skip duplicate anchor
        const seen = new Set<number>();            // L6: fresh set per anchor
        let j = i + 1;                             // L7: O(1)
        while (j < n) {                            // L8: inner scan
            const need = -nums[i] - nums[j];       // L9: O(1) complement
            if (seen.has(need)) {                  // L10: O(1) lookup
                result.push([nums[i], need, nums[j]]); // L11: O(1)
                while (j + 1 < n && nums[j + 1] === nums[j]) j++; // L12: skip j-dupes
            }
            seen.add(nums[j]);                     // L13: O(1)
            j++;                                   // L14: O(1)
        }
    }
    return result;
}

function normalize(result: number[][]): string {
    return JSON.stringify(result.map(t => [...t].sort((a, b) => a - b)).sort((a, b) => {
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
        return 0;
    }));
}

assert(normalize(threeSum([-1, 0, 1, 2, -1, -4])) === normalize([[-1, -1, 2], [-1, 0, 1]]));
assert(JSON.stringify(threeSum([0, 1, 1])) === JSON.stringify([]));
assert(JSON.stringify(threeSum([0, 0, 0])) === JSON.stringify([[0, 0, 0]]));
assert(JSON.stringify(threeSum([])) === JSON.stringify([]));
assert(normalize(threeSum([-2, 0, 0, 2, 2])) === normalize([[-2, 0, 2]]));
console.log('all tests pass');
