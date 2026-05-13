function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function subarraySum(nums: number[], k: number): number {
    const count = new Map<number, number>();  // L1: O(1)
    count.set(0, 1);                          // L2: O(1), seed for subarrays starting at index 0
    let prefix = 0;                           // L3: O(1)
    let result = 0;                           // L4: O(1)
    for (const x of nums) {                  // L5: loop, n iterations
        prefix += x;                          // L6: O(1) extend prefix sum
        result += count.get(prefix - k) ?? 0; // L7: O(1) map lookup
        count.set(prefix, (count.get(prefix) ?? 0) + 1);  // L8: O(1) record
    }
    return result;
}

assert(subarraySum([1, 1, 1], 2) === 2);
assert(subarraySum([1, 2, 3], 3) === 2);
assert(subarraySum([1], 0) === 0);
assert(subarraySum([1], 1) === 1);
assert(subarraySum([-1, -1, 1], 0) === 1);
assert(subarraySum([0, 0, 0, 0], 0) === 10);
console.log('all tests pass');
