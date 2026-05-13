function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap on [cost, city, stops]
class MinHeap {
    private data: [number, number, number][] = [];
    push(item: [number, number, number]): void {
        this.data.push(item);
        this._bubbleUp(this.data.length - 1);
    }
    pop(): [number, number, number] {
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

function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    const graph = new Map<number, [number, number][]>();
    for (const [u, v, w] of flights) {
        if (!graph.has(u)) graph.set(u, []);
        graph.get(u)!.push([v, w]);
    }
    const heap = new MinHeap();
    heap.push([0, src, k + 1]);
    while (heap.size > 0) {
        const [cost, city, stops] = heap.pop();
        if (city === dst) return cost;
        if (stops > 0) {
            for (const [nb, w] of (graph.get(city) ?? [])) {
                heap.push([cost + w, nb, stops - 1]);
            }
        }
    }
    return -1;
}

const flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]];
assert(findCheapestPrice(4, flights, 0, 3, 1) === 700);
assert(findCheapestPrice(4, flights, 0, 3, 0) === -1);
assert(findCheapestPrice(4, flights, 0, 3, 2) === 400);
assert(findCheapestPrice(2, [[0,1,500]], 0, 1, 0) === 500);
assert(findCheapestPrice(3, [[0,1,100],[1,2,50]], 1, 1, 1) === 0);
assert(findCheapestPrice(3, [[0,1,100]], 0, 2, 5) === -1);
console.log('all tests pass');
