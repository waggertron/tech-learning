function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function insert(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let i = 0;
    const n = intervals.length;
    let ni = [...newInterval];

    // phase 1: before
    while (i < n && intervals[i][1] < ni[0]) {
        result.push([...intervals[i]]);
        i++;
    }

    // phase 2: overlap
    while (i < n && intervals[i][0] <= ni[1]) {
        ni = [Math.min(ni[0], intervals[i][0]), Math.max(ni[1], intervals[i][1])];
        i++;
    }
    result.push(ni);

    // phase 3: after
    while (i < n) {
        result.push([...intervals[i]]);
        i++;
    }

    return result;
}

assert(JSON.stringify(insert([[1,3],[6,9]], [2,5])) === JSON.stringify([[1,5],[6,9]]));
assert(JSON.stringify(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])) === JSON.stringify([[1,2],[3,10],[12,16]]));
assert(JSON.stringify(insert([[3,5],[6,9]], [1,2])) === JSON.stringify([[1,2],[3,5],[6,9]]));
assert(JSON.stringify(insert([[1,2],[3,5]], [7,9])) === JSON.stringify([[1,2],[3,5],[7,9]]));
assert(JSON.stringify(insert([[1,2],[3,4],[5,6]], [0,10])) === JSON.stringify([[0,10]]));
assert(JSON.stringify(insert([], [1,5])) === JSON.stringify([[1,5]]));
console.log("all tests pass");
