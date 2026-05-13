function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isBipartite(graph: number[][]): boolean {
    const n = graph.length;
    const color = new Array(n).fill(-1);

    for (let start = 0; start < n; start++) {
        if (color[start] !== -1) continue;
        color[start] = 0;
        const q: number[] = [start];
        let head = 0;
        while (head < q.length) {
            const node = q[head++];
            for (const neighbor of graph[node]) {
                if (color[neighbor] === -1) {
                    color[neighbor] = 1 - color[node];
                    q.push(neighbor);
                } else if (color[neighbor] === color[node]) {
                    return false;
                }
            }
        }
    }
    return true;
}

assert(isBipartite([[1,2,3],[0,2],[0,1,3],[0,2]]) === false);
assert(isBipartite([[1,3],[0,2],[1,3],[0,2]]) === true);
assert(isBipartite([[]]) === true);
assert(isBipartite([[1],[0]]) === true);
assert(isBipartite([[1,2],[0,2],[0,1]]) === false);
assert(isBipartite([[1],[0],[3],[2]]) === true);
console.log('all tests pass');
