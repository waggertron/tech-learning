function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canAttendMeetings(intervals: number[][]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(canAttendMeetings([[0,30],[5,10],[15,20]]) === false);
    assert(canAttendMeetings([[7,10],[2,4]]) === true);
    assert(canAttendMeetings([]) === true);
    assert(canAttendMeetings([[1,5]]) === true);
    assert(canAttendMeetings([[1,5],[5,10]]) === true);
    assert(canAttendMeetings([[1,6],[5,10]]) === false);

    // perf
    const t0 = performance.now();
    canAttendMeetings(Array.from({ length: 500_000 }, (_, i) => [2 * i, 2 * i + 1]));
    console.log(`perf canAttendMeetings 500000 non-overlapping intervals: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
