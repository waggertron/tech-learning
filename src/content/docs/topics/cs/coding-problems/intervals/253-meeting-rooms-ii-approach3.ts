function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minMeetingRooms(intervals: number[][]): number {
    const starts = intervals.map(([s]) => s).sort((a, b) => a - b);
    const ends = intervals.map(([, e]) => e).sort((a, b) => a - b);
    let i = 0, j = 0, used = 0, best = 0;
    while (i < intervals.length) {
        if (starts[i] < ends[j]) {
            used++;
            best = Math.max(best, used);
            i++;
        } else {
            used--;
            j++;
        }
    }
    return best;
}

assert(minMeetingRooms([[0,30],[5,10],[15,20]]) === 2);
assert(minMeetingRooms([[7,10],[2,4]]) === 1);
assert(minMeetingRooms([[1,5]]) === 1);
assert(minMeetingRooms([]) === 0);
assert(minMeetingRooms([[1,4],[2,5],[3,6]]) === 3);
assert(minMeetingRooms([[0,5],[5,10],[10,15]]) === 1);
console.log("all tests pass");
