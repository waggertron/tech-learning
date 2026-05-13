function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function twoSum(numbers: number[], target: number): number[] {
    let l = 0, r = numbers.length - 1;   // L1: O(1) init pointers
    while (l < r) {                       // L2: at most n iterations
        const s = numbers[l] + numbers[r]; // L3: O(1) sum
        if (s === target)                 // L4: O(1) check
            return [l + 1, r + 1];        // L5: O(1) return (1-indexed)
        if (s < target) l++;             // L6/L7: O(1) advance left
        else r--;                        // L8: O(1) advance right
    }
    return [];
}

assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([1, 2]));
assert(JSON.stringify(twoSum([2, 3, 4], 6)) === JSON.stringify([1, 3]));
assert(JSON.stringify(twoSum([3, 3], 6)) === JSON.stringify([1, 2]));
assert(JSON.stringify(twoSum([1, 2, 3, 4, 5], 9)) === JSON.stringify([4, 5]));
assert(JSON.stringify(twoSum([-3, -1, 0, 2, 4], 1)) === JSON.stringify([1, 5]));
console.log('all tests pass');
