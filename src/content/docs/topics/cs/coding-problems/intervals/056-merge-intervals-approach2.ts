function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const result: number[][] = [];
    for (const interval of intervals) {
        if (result.length > 0 && interval[0] <= result[result.length - 1][1]) {
            result[result.length - 1][1] = Math.max(result[result.length - 1][1], interval[1]);
        } else {
            result.push([...interval]);
        }
    }
    return result;
}

assert(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])) === JSON.stringify([[1,6],[8,10],[15,18]]));
assert(JSON.stringify(merge([[1,4],[4,5]])) === JSON.stringify([[1,5]]));
assert(JSON.stringify(merge([[1,2]])) === JSON.stringify([[1,2]]));
assert(JSON.stringify(merge([[1,10],[2,5],[3,8]])) === JSON.stringify([[1,10]]));
assert(JSON.stringify(merge([[1,2],[3,4],[5,6]])) === JSON.stringify([[1,2],[3,4],[5,6]]));
assert(JSON.stringify(merge([[15,18],[1,3],[2,6],[8,10]])) === JSON.stringify([[1,6],[8,10],[15,18]]));
console.log("all tests pass");
