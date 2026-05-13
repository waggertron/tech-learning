function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function sumSubarrayMins(arr: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(sumSubarrayMins([3, 1, 2, 4]) === 17);
    assert(sumSubarrayMins([11, 81, 94, 43, 3]) === 444);
    assert(sumSubarrayMins([3]) === 3);
    console.log('all tests pass');
}

_runTests();
