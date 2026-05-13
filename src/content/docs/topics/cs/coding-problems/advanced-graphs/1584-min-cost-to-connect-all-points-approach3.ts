function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class MinHeap {
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

function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    const visited = new Array(n).fill(false);
    const heap = new MinHeap();
    heap.push([0, 0]);
    let total = 0, count = 0;

    while (heap.size > 0 && count < n) {
        const [d, u] = heap.pop();
        if (visited[u]) continue;
        visited[u] = true;
        total += d;
        count++;
        for (let v = 0; v < n; v++) {
            if (!visited[v]) {
                const dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                heap.push([dist, v]);
            }
        }
    }
    return total;
}

assert(minCostConnectPoints([[0,0],[2,2],[3,10],[5,2],[7,0]]) === 20);
assert(minCostConnectPoints([[3,12],[-2,5],[-4,1]]) === 18);
assert(minCostConnectPoints([[0,0]]) === 0);
assert(minCostConnectPoints([[0,0],[1,1]]) === 2);
assert(minCostConnectPoints([[0,0],[1,0],[2,0],[3,0]]) === 3);
console.log('all tests pass');
