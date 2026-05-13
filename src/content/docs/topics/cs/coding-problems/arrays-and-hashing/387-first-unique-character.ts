function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function firstUniqChar(s: string): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(firstUniqChar('leetcode') === 0);
    assert(firstUniqChar('loveleetcode') === 2);
    assert(firstUniqChar('aabb') === -1);
    assert(firstUniqChar('z') === 0);
    assert(firstUniqChar('aab') === 2);
    // perf
    const t0 = performance.now();
    firstUniqChar('a'.repeat(1_000_000) + 'b');
    console.log(`perf firstUniqChar n=1000001: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
