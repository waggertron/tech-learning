function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findOrder(numCourses: number, prerequisites: number[][]): number[] {
    const graph: number[][] = Array.from({ length: numCourses }, () => []);
    for (const [a, b] of prerequisites) graph[b].push(a);

    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Array(numCourses).fill(WHITE);
    const order: number[] = [];
    let hasCycle = false;

    function dfs(n: number): void {
        if (hasCycle) return;
        color[n] = GRAY;
        for (const nb of graph[n]) {
            if (color[nb] === WHITE) dfs(nb);
            else if (color[nb] === GRAY) { hasCycle = true; return; }
        }
        color[n] = BLACK;
        order.push(n);
    }

    for (let c = 0; c < numCourses; c++) {
        if (color[c] === WHITE) dfs(c);
    }

    if (hasCycle) return [];
    return order.reverse();
}

const r1 = findOrder(2, [[1, 0]]);
assert(JSON.stringify(r1) === JSON.stringify([0, 1]));
const r2 = findOrder(4, [[1,0],[2,0],[3,1],[3,2]]);
assert(r2.indexOf(0) < r2.indexOf(1));
assert(r2.indexOf(0) < r2.indexOf(2));
assert(r2.indexOf(1) < r2.indexOf(3));
assert(r2.indexOf(2) < r2.indexOf(3));
assert(JSON.stringify(findOrder(2, [[1,0],[0,1]])) === JSON.stringify([]));
assert(JSON.stringify(findOrder(1, [])) === JSON.stringify([0]));
const r3 = findOrder(3, []);
assert(new Set(r3).size === 3);
assert(JSON.stringify(findOrder(3, [[0,1],[1,2],[2,0]])) === JSON.stringify([]));
console.log('all tests pass');
