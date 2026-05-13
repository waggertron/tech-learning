function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function eraseOverlapIntervals(intervals: number[][]): number {
    intervals.sort((a, b) => a[0] - b[0]);
    let count = 0;
    let prevEnd = -Infinity;
    for (const [s, e] of intervals) {
        if (s >= prevEnd) {
            prevEnd = e;
        } else {
            count++;
            prevEnd = Math.min(prevEnd, e);
        }
    }
    return count;
}

assert(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]) === 1);
assert(eraseOverlapIntervals([[1,2],[1,2],[1,2]]) === 2);
assert(eraseOverlapIntervals([[1,2],[2,3]]) === 0);
assert(eraseOverlapIntervals([[1,5]]) === 0);
assert(eraseOverlapIntervals([]) === 0);
assert(eraseOverlapIntervals([[1,100],[2,3],[4,5],[6,7]]) === 1);
console.log("all tests pass");
