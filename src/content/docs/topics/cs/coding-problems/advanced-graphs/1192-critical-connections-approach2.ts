function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function criticalConnections(n: number, connections: number[][]): number[][] {
    const graph = new Map<number, number[]>();
    for (let i = 0; i < n; i++) graph.set(i, []);
    for (const [u, v] of connections) {
        graph.get(u)!.push(v);
        graph.get(v)!.push(u);
    }

    const disc = new Array(n).fill(-1);
    const low = new Array(n).fill(0);
    const bridges: number[][] = [];
    let timer = 0;

    function dfs(node: number, parent: number): void {
        disc[node] = low[node] = timer++;
        for (const neighbor of graph.get(node)!) {
            if (neighbor === parent) continue;
            if (disc[neighbor] === -1) {
                dfs(neighbor, node);
                low[node] = Math.min(low[node], low[neighbor]);
                if (low[neighbor] > disc[node]) bridges.push([node, neighbor]);
            } else {
                low[node] = Math.min(low[node], disc[neighbor]);
            }
        }
    }

    for (let i = 0; i < n; i++) if (disc[i] === -1) dfs(i, -1);
    return bridges;
}

assert(JSON.stringify(criticalConnections(4, [[0,1],[1,2],[2,0],[1,3]])) === JSON.stringify([[1,3]]));
assert(JSON.stringify(criticalConnections(2, [[0,1]])) === JSON.stringify([[0,1]]));
assert(JSON.stringify(criticalConnections(3, [[0,1],[1,2],[0,2]])) === JSON.stringify([]));
const r = criticalConnections(6, [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[1,3]]);
assert(JSON.stringify([...r].sort((a, b) => a[0] - b[0] || a[1] - b[1])) === JSON.stringify([[1,3]]));
console.log('all tests pass');
