function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    const inMst = new Array(n).fill(false);
    const minDist = new Array(n).fill(Infinity);
    minDist[0] = 0;
    let total = 0;

    for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let v = 0; v < n; v++) {
            if (!inMst[v] && (u === -1 || minDist[v] < minDist[u])) u = v;
        }
        inMst[u] = true;
        total += minDist[u];
        for (let v = 0; v < n; v++) {
            if (!inMst[v]) {
                const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                if (d < minDist[v]) minDist[v] = d;
            }
        }
    }
    return total;
}

assert(minCostConnectPoints([[0,0],[2,2],[3,10],[5,2],[7,0]]) === 20);
assert(minCostConnectPoints([[3,12],[-2,5],[-4,1]]) === 18);
assert(minCostConnectPoints([[0,0]]) === 0);
assert(minCostConnectPoints([[0,0],[1,1]]) === 2);
assert(minCostConnectPoints([[0,0],[1,0],[2,0],[3,0]]) === 3);
console.log('all tests pass');
