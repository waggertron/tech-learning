function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const answer = new Array(n).fill(1);                  // L2: O(n)
    for (let i = 1; i < n; i++)
        answer[i] = answer[i - 1] * nums[i - 1];         // L4: O(1)
    let suffix = 1;                                        // L5: O(1)
    for (let i = n - 1; i >= 0; i--) {                   // L6: n steps
        answer[i] *= suffix;                              // L7: O(1)
        suffix *= nums[i];                                // L8: O(1)
    }
    return answer;
}

assert(JSON.stringify(productExceptSelf([1, 2, 3, 4])) === JSON.stringify([24, 12, 8, 6]));
assert(JSON.stringify(productExceptSelf([-1, 1, 0, -3, 3])) === JSON.stringify([0, 0, 9, 0, 0]));
assert(JSON.stringify(productExceptSelf([1, 1])) === JSON.stringify([1, 1]));
assert(JSON.stringify(productExceptSelf([2, 3])) === JSON.stringify([3, 2]));
assert(JSON.stringify(productExceptSelf([1, 0])) === JSON.stringify([0, 1]));
console.log("all tests pass");
