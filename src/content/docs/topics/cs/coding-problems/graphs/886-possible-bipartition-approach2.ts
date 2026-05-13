function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function possibleBipartition(n: number, dislikes: number[][]): boolean {
    const graph: number[][] = Array.from({ length: n + 1 }, () => []);
    for (const [a, b] of dislikes) {
        graph[a].push(b);
        graph[b].push(a);
    }

    const color = new Array(n + 1).fill(-1);

    for (let start = 1; start <= n; start++) {
        if (color[start] !== -1) continue;
        color[start] = 0;
        const q: number[] = [start];
        let head = 0;
        while (head < q.length) {
            const person = q[head++];
            for (const neighbor of graph[person]) {
                if (color[neighbor] === -1) {
                    color[neighbor] = 1 - color[person];
                    q.push(neighbor);
                } else if (color[neighbor] === color[person]) {
                    return false;
                }
            }
        }
    }
    return true;
}

assert(possibleBipartition(4, [[1,2],[1,3],[2,4]]) === true);
assert(possibleBipartition(3, [[1,2],[1,3],[2,3]]) === false);
assert(possibleBipartition(5, [[1,2],[2,3],[3,4],[4,5],[1,5]]) === false);
assert(possibleBipartition(4, []) === true);
assert(possibleBipartition(4, [[1,2],[3,4]]) === true);
assert(possibleBipartition(1, []) === true);
console.log('all tests pass');
