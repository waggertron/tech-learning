function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function bisectLeft(nums: number[], target: number, lo: number, hi: number): number {
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

function twoSum(numbers: number[], target: number): number[] {
    const n = numbers.length;                           // L1: O(1)
    for (let i = 0; i < n; i++) {                      // L2: outer loop, n iterations
        const need = target - numbers[i];              // L3: O(1) complement
        const j = bisectLeft(numbers, need, i + 1, n); // L4: O(log n) binary search
        if (j < n && numbers[j] === need)              // L5: O(1) verify
            return [i + 1, j + 1];                     // L6: O(1) return
    }
    return [];
}

assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([1, 2]));
assert(JSON.stringify(twoSum([2, 3, 4], 6)) === JSON.stringify([1, 3]));
assert(JSON.stringify(twoSum([3, 3], 6)) === JSON.stringify([1, 2]));
assert(JSON.stringify(twoSum([1, 2, 3, 4, 5], 9)) === JSON.stringify([4, 5]));
assert(JSON.stringify(twoSum([-3, -1, 0, 2, 4], 1)) === JSON.stringify([1, 5]));
console.log('all tests pass');
