function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])) === JSON.stringify([-1, 3, -1]));
    assert(JSON.stringify(nextGreaterElement([2, 4], [1, 2, 3, 4])) === JSON.stringify([3, -1]));
    assert(JSON.stringify(nextGreaterElement([1], [1])) === JSON.stringify([-1]));
    console.log('all tests pass');
}

_runTests();
