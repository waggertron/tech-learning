function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
    const nge = new Map<number, number>();
    const stack: number[] = [];

    for (const num of nums2) {
        while (stack.length && stack[stack.length - 1] < num)
            nge.set(stack.pop()!, num);
        stack.push(num);
    }

    for (const num of stack) nge.set(num, -1);

    return nums1.map(x => nge.get(x)!);
}

assert(JSON.stringify(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])) === JSON.stringify([-1, 3, -1]));
assert(JSON.stringify(nextGreaterElement([2, 4], [1, 2, 3, 4])) === JSON.stringify([3, -1]));
assert(JSON.stringify(nextGreaterElement([1], [1])) === JSON.stringify([-1]));
console.log('all tests pass');
