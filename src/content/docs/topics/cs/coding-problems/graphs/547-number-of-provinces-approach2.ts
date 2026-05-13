function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findCircleNum(isConnected: number[][]): number {
    const n = isConnected.length;
    const visited = new Array(n).fill(false);
    let provinces = 0;

    function dfs(city: number): void {
        visited[city] = true;
        for (let neighbor = 0; neighbor < n; neighbor++) {
            if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
                dfs(neighbor);
            }
        }
    }

    for (let city = 0; city < n; city++) {
        if (!visited[city]) {
            provinces++;
            dfs(city);
        }
    }
    return provinces;
}

assert(findCircleNum([[1,1,0],[1,1,0],[0,0,1]]) === 2);
assert(findCircleNum([[1,0,0],[0,1,0],[0,0,1]]) === 3);
assert(findCircleNum([[1,1,1],[1,1,1],[1,1,1]]) === 1);
assert(findCircleNum([[1]]) === 1);
assert(findCircleNum([[1,1,0],[1,1,1],[0,1,1]]) === 1);
console.log('all tests pass');
