function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canAttendMeetings(intervals: number[][]): boolean {
    const events: [number, number][] = [];
    for (const [s, e] of intervals) {
        events.push([s, 1]);
        events.push([e, -1]);
    }
    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    let cur = 0;
    for (const [, delta] of events) {
        cur += delta;
        if (cur > 1) return false;
    }
    return true;
}

assert(canAttendMeetings([[0,30],[5,10],[15,20]]) === false);
assert(canAttendMeetings([[7,10],[2,4]]) === true);
assert(canAttendMeetings([]) === true);
assert(canAttendMeetings([[1,5]]) === true);
assert(canAttendMeetings([[1,5],[5,10]]) === true);
assert(canAttendMeetings([[1,6],[5,10]]) === false);
console.log("all tests pass");
