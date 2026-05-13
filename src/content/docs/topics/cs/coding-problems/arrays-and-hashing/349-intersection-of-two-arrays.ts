function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function intersection(nums1: number[], nums2: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify([...intersection([1,2,2,1], [2,2])].sort((a,b)=>a-b)) === JSON.stringify([2]));
    assert(JSON.stringify([...intersection([4,9,5], [9,4,9,8,4])].sort((a,b)=>a-b)) === JSON.stringify([4,9]));
    assert(JSON.stringify(intersection([1,2,3], [4,5,6])) === JSON.stringify([]));
    assert(JSON.stringify([...intersection([1,1,1], [1,1,1])].sort((a,b)=>a-b)) === JSON.stringify([1]));
    // perf
    const t0 = performance.now();
    intersection(Array.from({length:10000},(_,i)=>i), Array.from({length:10000},(_,i)=>i+5000));
    console.log(`perf intersection n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
