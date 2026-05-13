function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);                        // L1: O(n log n)
    const n = nums.length;                             // L2: O(1)
    const result: number[][] = [];                     // L3: O(1)
    for (let i = 0; i < n - 2; i++) {                 // L4: outer loop
        if (nums[i] > 0) break;                        // L5: prune: all remaining >= 0
        if (i > 0 && nums[i] === nums[i - 1]) continue; // L6: skip duplicate anchor
        let l = i + 1, r = n - 1;                     // L7: init pointers
        while (l < r) {                                // L8: two-pointer scan
            const s = nums[i] + nums[l] + nums[r];    // L9: O(1) sum
            if (s < 0) l++;                            // L10/L11
            else if (s > 0) r--;                       // L12/L13
            else {
                result.push([nums[i], nums[l], nums[r]]); // L14
                l++;                                   // L15
                r--;                                   // L16
                while (l < r && nums[l] === nums[l - 1]) l++; // L17: skip l-dupes
                while (l < r && nums[r] === nums[r + 1]) r--; // L18: skip r-dupes
            }
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
assert(JSON.stringify(threeSum([-2, 0, 0, 2, 2])) === JSON.stringify([[-2, 0, 2]]));
console.log('all tests pass');
