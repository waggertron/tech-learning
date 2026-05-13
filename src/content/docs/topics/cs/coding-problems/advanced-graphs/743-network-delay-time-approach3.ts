function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap for [dist, node] pairs
class MinHeap {
    private data: [number, number][] = [];
    push(item: [number, number]): void {
        this.data.push(item);
        this._bubbleUp(this.data.length - 1);
    }
    pop(): [number, number] {
        const top = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            this._siftDown(0);
        }
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
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.data[l][0] < this.data[smallest][0]) smallest = l;
            if (r < n && this.data[r][0] < this.data[smallest][0]) smallest = r;
            if (smallest === i) break;
            [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
            i = smallest;
        }
    }
}

function networkDelayTime(times: number[][], n: number, k: number): number {
    const graph = new Map<number, [number, number][]>();
    for (const [u, v, w] of times) {
        if (!graph.has(u)) graph.set(u, []);
        graph.get(u)!.push([v, w]);
    }

    const dist = new Map<number, number>();
    dist.set(k, 0);
    const heap = new MinHeap();
    heap.push([0, k]);

    while (heap.size > 0) {
        const [d, u] = heap.pop();
        if (d > (dist.get(u) ?? Infinity)) continue;
        for (const [v, w] of (graph.get(u) ?? [])) {
            const nd = d + w;
            if (nd < (dist.get(v) ?? Infinity)) {
                dist.set(v, nd);
                heap.push([nd, v]);
            }
        }
    }

    if (dist.size !== n) return -1;
    return Math.max(...dist.values());
}

assert(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2) === 2);
assert(networkDelayTime([[1,2,1]], 2, 1) === 1);
assert(networkDelayTime([[1,2,1]], 2, 2) === -1);
assert(networkDelayTime([], 1, 1) === 0);
assert(networkDelayTime([[1,2,1],[1,2,5]], 2, 1) === 1);
console.log('all tests pass');
