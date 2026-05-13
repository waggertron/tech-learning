function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function insert(intervals: number[][], newInterval: number[]): number[][] {
    intervals = intervals.map(iv => [...iv]);
    const starts = intervals.map(iv => iv[0]);

    // binary search for insertion index
    let lo = 0, hi = starts.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (starts[mid] < newInterval[0]) lo = mid + 1;
        else hi = mid;
    }
    let idx = lo;
    intervals.splice(idx, 0, [...newInterval]);

    // merge leftward
    while (idx > 0 && intervals[idx - 1][1] >= intervals[idx][0]) {
        intervals[idx - 1][1] = Math.max(intervals[idx - 1][1], intervals[idx][1]);
        intervals.splice(idx, 1);
        idx--;
    }

    // merge rightward
    while (idx + 1 < intervals.length && intervals[idx][1] >= intervals[idx + 1][0]) {
        intervals[idx][1] = Math.max(intervals[idx][1], intervals[idx + 1][1]);
        intervals.splice(idx + 1, 1);
    }

    return intervals;
}

assert(JSON.stringify(insert([[1,3],[6,9]], [2,5])) === JSON.stringify([[1,5],[6,9]]));
assert(JSON.stringify(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])) === JSON.stringify([[1,2],[3,10],[12,16]]));
assert(JSON.stringify(insert([[3,5],[6,9]], [1,2])) === JSON.stringify([[1,2],[3,5],[6,9]]));
assert(JSON.stringify(insert([[1,2],[3,5]], [7,9])) === JSON.stringify([[1,2],[3,5],[7,9]]));
assert(JSON.stringify(insert([[1,2],[3,4],[5,6]], [0,10])) === JSON.stringify([[0,10]]));
assert(JSON.stringify(insert([], [1,5])) === JSON.stringify([[1,5]]));
console.log("all tests pass");
