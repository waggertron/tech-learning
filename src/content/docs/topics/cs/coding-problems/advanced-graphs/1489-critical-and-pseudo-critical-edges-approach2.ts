function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class UnionFind {
    parent: number[];
    rank: number[];
    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(x: number): number {
        if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    union(x: number, y: number): boolean {
        let rx = this.find(x), ry = this.find(y);
        if (rx === ry) return false;
        if (this.rank[rx] < this.rank[ry]) [rx, ry] = [ry, rx];
        this.parent[ry] = rx;
        if (this.rank[rx] === this.rank[ry]) this.rank[rx]++;
        return true;
    }
}

function findCriticalAndPseudoCriticalEdges(n: number, edges: number[][]): number[][] {
    const indexed: [number, number, number, number][] = edges.map(([u, v, w], i) => [w, u, v, i]);
    indexed.sort((a, b) => a[0] - b[0]);

    function kruskal(skip = -1, force = -1): number {
        const uf = new UnionFind(n);
        let weight = 0, count = 0;
        if (force !== -1) {
            const [w, u, v] = indexed[force];
            uf.union(u, v);
            weight += w;
            count++;
        }
        for (let idx = 0; idx < indexed.length; idx++) {
            if (idx === skip) continue;
            const [w, u, v] = indexed[idx];
            if (uf.union(u, v)) { weight += w; count++; }
        }
        return count < n - 1 ? Infinity : weight;
    }

    const base = kruskal();
    const critical: number[] = [], pseudo: number[] = [];
    for (let i = 0; i < indexed.length; i++) {
        if (kruskal(i) > base) critical.push(indexed[i][3]);
        else if (kruskal(-1, i) === base) pseudo.push(indexed[i][3]);
    }
    critical.sort((a, b) => a - b);
    pseudo.sort((a, b) => a - b);
    return [critical, pseudo];
}

assert(JSON.stringify(findCriticalAndPseudoCriticalEdges(5, [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]])) === JSON.stringify([[0,1],[2,3,4,5]]));
assert(JSON.stringify(findCriticalAndPseudoCriticalEdges(4, [[0,1,1],[1,2,1],[2,3,1],[0,3,1]])) === JSON.stringify([[],[0,1,2,3]]));
assert(JSON.stringify(findCriticalAndPseudoCriticalEdges(2, [[0,1,5]])) === JSON.stringify([[0],[]]));
console.log('all tests pass');
