function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canAttendMeetings(intervals: number[][]): boolean {
    intervals.sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) return false;
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
