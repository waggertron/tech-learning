function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    const graph: number[][] = Array.from({ length: numCourses }, () => []);
    for (const [a, b] of prerequisites) graph[b].push(a);

    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Array(numCourses).fill(WHITE);

    function dfs(n: number): boolean {
        if (color[n] === GRAY) return false;
        if (color[n] === BLACK) return true;
        color[n] = GRAY;
        for (const nb of graph[n]) {
            if (!dfs(nb)) return false;
        }
        color[n] = BLACK;
        return true;
    }

    for (let c = 0; c < numCourses; c++) {
        if (!dfs(c)) return false;
    }
    return true;
}

assert(canFinish(2, [[1, 0]]) === true);
assert(canFinish(2, [[1, 0], [0, 1]]) === false);
assert(canFinish(5, []) === true);
assert(canFinish(1, []) === true);
assert(canFinish(3, [[1, 0], [2, 1], [0, 2]]) === false);
assert(canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]) === true);
console.log('all tests pass');
