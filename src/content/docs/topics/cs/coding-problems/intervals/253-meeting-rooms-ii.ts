function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minMeetingRooms(intervals: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(minMeetingRooms([[0,30],[5,10],[15,20]]) === 2);
    assert(minMeetingRooms([[7,10],[2,4]]) === 1);
    assert(minMeetingRooms([[1,5]]) === 1);
    assert(minMeetingRooms([]) === 0);
    assert(minMeetingRooms([[1,4],[2,5],[3,6]]) === 3);
    assert(minMeetingRooms([[0,5],[5,10],[10,15]]) === 1);

    // perf
    const t0 = performance.now();
    minMeetingRooms(Array.from({ length: 500_000 }, (_, i) => [2 * i, 2 * i + 1]));
    console.log(`perf minMeetingRooms 500000 non-overlapping intervals: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
