function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function merge(intervals: number[][]): number[][] {
    if (intervals.length === 0) return [];
    const maxV = Math.max(...intervals.map(([, e]) => e));
    const starts = new Array(maxV + 2).fill(0);
    const ends = new Array(maxV + 2).fill(0);
    for (const [s, e] of intervals) {
        starts[s]++;
        ends[e]++;
    }

    const result: number[][] = [];
    let openCount = 0;
    let curStart = 0;
    for (let i = 0; i <= maxV + 1; i++) {
        if (starts[i] > 0 && openCount === 0) curStart = i;
        openCount += starts[i];
        if (ends[i] > 0) {
            openCount -= ends[i];
            if (openCount === 0) result.push([curStart, i]);
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
