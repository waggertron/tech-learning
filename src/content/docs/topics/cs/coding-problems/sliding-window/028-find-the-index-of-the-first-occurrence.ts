function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function strStr(haystack: string, needle: string): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(strStr('sadbutsad', 'sad') === 0);
    assert(strStr('leetcode', 'leeto') === -1);
    assert(strStr('hello', 'll') === 2);
    assert(strStr('a', 'a') === 0);
    assert(strStr('mississippi', 'issip') === 4);
    // perf
    const t0 = performance.now();
    strStr('a'.repeat(1_000_000) + 'b', 'ab');
    console.log(`perf str_str n=1000001: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
