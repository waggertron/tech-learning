function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Max-heap on probability using negation: store [-prob, node]
class MaxProbHeap {
    private data: [number, number][] = [];
    push(item: [number, number]): void {
        this.data.push(item);
        this._bubbleUp(this.data.length - 1);
    }
    pop(): [number, number] {
        const top = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) { this.data[0] = last; this._siftDown(0); }
        return top;
    }
    get size(): number { return this.data.length; }
    private _bubbleUp(i: number): void {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p][0] <= this.data[i][0]) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }
    private _siftDown(i: number): void {
        const n = this.data.length;
        while (true) {
            let s = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.data[l][0] < this.data[s][0]) s = l;
            if (r < n && this.data[r][0] < this.data[s][0]) s = r;
            if (s === i) break;
            [this.data[s], this.data[i]] = [this.data[i], this.data[s]];
            i = s;
        }
    }
}

function maxProbability(n: number, edges: number[][], succProb: number[], start: number, end: number): number {
    const graph = new Map<number, [number, number][]>();
    for (let i = 0; i < n; i++) graph.set(i, []);
    for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        graph.get(u)!.push([v, succProb[i]]);
        graph.get(v)!.push([u, succProb[i]]);
    }

    const prob = new Array(n).fill(0.0);
    prob[start] = 1.0;
    const heap = new MaxProbHeap();
    heap.push([-1.0, start]);

    while (heap.size > 0) {
        const [negP, u] = heap.pop();
        const p = -negP;
        if (p < prob[u]) continue;
        if (u === end) return p;
        for (const [v, edgeP] of graph.get(u)!) {
            const newP = p * edgeP;
            if (newP > prob[v]) {
                prob[v] = newP;
                heap.push([-newP, v]);
            }
        }
    }
    return prob[end];
}

assert(Math.abs(maxProbability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.2], 0, 2) - 0.25) < 1e-5);
assert(Math.abs(maxProbability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.3], 0, 2) - 0.3) < 1e-5);
assert(maxProbability(3, [[0,1]], [0.5], 0, 2) === 0.0);
assert(Math.abs(maxProbability(2, [[0,1]], [0.9], 0, 1) - 0.9) < 1e-5);
assert(Math.abs(maxProbability(3, [[0,1],[1,2]], [0.5,0.5], 1, 1) - 1.0) < 1e-5);
console.log('all tests pass');
