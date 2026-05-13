function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findDuplicate(nums: number[]): number {
    let slow = nums[0];
    let fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}

assert(findDuplicate([1,3,4,2,2]) === 2);
assert(findDuplicate([3,1,3,4,2]) === 3);
assert(findDuplicate([3,3,3,3,3]) === 3);
assert(findDuplicate([1,1]) === 1);
assert(findDuplicate([2,2,2,1]) === 2);
console.log('all tests pass');
