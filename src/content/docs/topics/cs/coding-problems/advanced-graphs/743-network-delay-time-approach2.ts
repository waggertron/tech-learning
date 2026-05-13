function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function networkDelayTime(times: number[][], n: number, k: number): number {
    const INF = Infinity;
    const dist: number[][] = Array.from({ length: n + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === j ? 0 : INF))
    );
    for (const [u, v, w] of times) dist[u][v] = w;
    for (let mid = 1; mid <= n; mid++)
        for (let i = 1; i <= n; i++)
            for (let j = 1; j <= n; j++)
                if (dist[i][mid] + dist[mid][j] < dist[i][j])
                    dist[i][j] = dist[i][mid] + dist[mid][j];
    const m = Math.max(...dist[k].slice(1));
    return m === INF ? -1 : m;
}

assert(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2) === 2);
assert(networkDelayTime([[1,2,1]], 2, 1) === 1);
assert(networkDelayTime([[1,2,1]], 2, 2) === -1);
assert(networkDelayTime([], 1, 1) === 0);
assert(networkDelayTime([[1,2,1],[1,2,5]], 2, 1) === 1);
console.log('all tests pass');
