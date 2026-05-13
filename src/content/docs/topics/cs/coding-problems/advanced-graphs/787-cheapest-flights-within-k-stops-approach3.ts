function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    const INF = Infinity;
    let dist = new Array(n).fill(INF);
    dist[src] = 0;
    for (let round = 0; round <= k; round++) {
        const newDist = [...dist];
        for (const [u, v, w] of flights) {
            if (dist[u] !== INF && dist[u] + w < newDist[v]) {
                newDist[v] = dist[u] + w;
            }
        }
        dist = newDist;
    }
    return dist[dst] === INF ? -1 : dist[dst];
}

const flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]];
assert(findCheapestPrice(4, flights, 0, 3, 1) === 700);
assert(findCheapestPrice(4, flights, 0, 3, 0) === -1);
assert(findCheapestPrice(4, flights, 0, 3, 2) === 400);
assert(findCheapestPrice(2, [[0,1,500]], 0, 1, 0) === 500);
assert(findCheapestPrice(3, [[0,1,100],[1,2,50]], 1, 1, 1) === 0);
assert(findCheapestPrice(3, [[0,1,100]], 0, 2, 5) === -1);
console.log('all tests pass');
