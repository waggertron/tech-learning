function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function nextGreaterElements(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack: number[] = [];

    for (let i = 0; i < 2 * n; i++) {
        while (stack.length && nums[stack[stack.length - 1]] < nums[i % n])
            result[stack.pop()!] = nums[i % n];
        if (i < n) stack.push(i);
    }

    return result;
}

assert(JSON.stringify(nextGreaterElements([1, 2, 1])) === JSON.stringify([2, -1, 2]));
assert(JSON.stringify(nextGreaterElements([1, 2, 3, 4, 3])) === JSON.stringify([2, 3, 4, -1, 4]));
assert(JSON.stringify(nextGreaterElements([5, 4, 3, 2, 1])) === JSON.stringify([-1, 5, 5, 5, 5]));
assert(JSON.stringify(nextGreaterElements([1])) === JSON.stringify([-1]));
console.log('all tests pass');
