function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Max-heap on (negated distance, x, y)
type Entry = [number, number, number];

class MaxHeap {
    private data: Entry[] = [];

    get size(): number { return this.data.length; }
    get top(): Entry { return this.data[0]; }

    push(val: Entry): void {
        this.data.push(val);
        this._siftUp(this.data.length - 1);
    }

    // Replace top with val (like heapreplace)
    replace(val: Entry): void {
        this.data[0] = val;
        this._siftDown(0);
    }

    private _siftUp(i: number): void {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p][0] >= this.data[i][0]) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }

    private _siftDown(i: number): void {
        const n = this.data.length;
        while (true) {
            let largest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.data[l][0] > this.data[largest][0]) largest = l;
            if (r < n && this.data[r][0] > this.data[largest][0]) largest = r;
            if (largest === i) break;
            [this.data[largest], this.data[i]] = [this.data[i], this.data[largest]];
            i = largest;
        }
    }
}

function kClosest(points: number[][], k: number): number[][] {
    const heap = new MaxHeap();
    for (const [x, y] of points) {             // L1: iterate n points
        const d = -(x * x + y * y);
        if (heap.size < k) {
            heap.push([d, x, y]);              // L2: O(log k) push
        } else if (d > heap.top[0]) {
            heap.replace([d, x, y]);           // L3: O(log k) replace farthest
        }
    }
    return (heap as any).data.map(([, x, y]: Entry) => [x, y]);
}

let result = kClosest([[1, 3], [-2, 2]], 1);
assert(JSON.stringify(result) === JSON.stringify([[-2, 2]]), `got ${JSON.stringify(result)}`);

result = kClosest([[3, 3], [5, -1], [-2, 4]], 2);
const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];
assert(
    JSON.stringify(result.slice().sort(sortFn)) === JSON.stringify([[3, 3], [-2, 4]].sort(sortFn)),
    `got ${JSON.stringify(result)}`
);

assert(JSON.stringify(kClosest([[0, 0]], 1)) === JSON.stringify([[0, 0]]));

result = kClosest([[1, 0], [-1, 0], [0, 1], [0, -1]], 2);
assert(result.length === 2);

result = kClosest([[1, 2], [3, 4], [0, 0]], 3);
assert(result.length === 3);

console.log("all tests pass");
