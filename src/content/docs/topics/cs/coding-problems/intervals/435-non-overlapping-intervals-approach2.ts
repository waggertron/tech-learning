function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function eraseOverlapIntervals(intervals: number[][]): number {
    intervals.sort((a, b) => a[1] - b[1]);
    let count = 0;
    let end = -Infinity;
    for (const [s, e] of intervals) {
        if (s >= end) {
            end = e;
        } else {
            count++;
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
