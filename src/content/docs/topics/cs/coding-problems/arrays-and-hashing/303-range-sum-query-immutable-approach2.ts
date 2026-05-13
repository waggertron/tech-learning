function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class NumArray {
    private prefix: number[];

    constructor(nums: number[]) {
        this.prefix = new Array(nums.length + 1).fill(0);   // L1: O(n) allocate
        for (let i = 0; i < nums.length; i++)
            this.prefix[i + 1] = this.prefix[i] + nums[i]; // L3: O(1) per step
    }

    sumRange(left: number, right: number): number {
        return this.prefix[right + 1] - this.prefix[left];  // L4: O(1)
    }
}

const na = new NumArray([-2, 0, 3, -5, 2, -1]);
assert(na.sumRange(0, 2) === 1);
assert(na.sumRange(2, 5) === -1);
assert(na.sumRange(0, 5) === -3);
const na2 = new NumArray([5]);
assert(na2.sumRange(0, 0) === 5);
const na3 = new NumArray([-1, -2, -3]);
assert(na3.sumRange(0, 2) === -6);
assert(na3.sumRange(1, 2) === -5);
console.log("all tests pass");
