function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function nextGreaterElements(nums: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(nextGreaterElements([1, 2, 1])) === JSON.stringify([2, -1, 2]));
    assert(JSON.stringify(nextGreaterElements([1, 2, 3, 4, 3])) === JSON.stringify([2, 3, 4, -1, 4]));
    assert(JSON.stringify(nextGreaterElements([5, 4, 3, 2, 1])) === JSON.stringify([-1, 5, 5, 5, 5]));
    assert(JSON.stringify(nextGreaterElements([1])) === JSON.stringify([-1]));
    console.log('all tests pass');
}

_runTests();
