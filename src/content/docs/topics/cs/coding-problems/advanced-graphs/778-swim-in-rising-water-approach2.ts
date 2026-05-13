function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

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

function swimInWater(grid: number[][]): number {
    const n = grid.length;
    const heap = new MinHeap();
    heap.push([grid[0][0], 0, 0]);
    const visited = new Set<number>();

    while (heap.size > 0) {
        const [t, r, c] = heap.pop();
        const key = r * n + c;
        if (visited.has(key)) continue;
        visited.add(key);
        if (r === n - 1 && c === n - 1) return t;
        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited.has(nr * n + nc)) {
                heap.push([Math.max(t, grid[nr][nc]), nr, nc]);
            }
        }
    }
    return -1;
}

assert(swimInWater([[0,2],[1,3]]) === 3);
assert(swimInWater([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]) === 16);
assert(swimInWater([[0]]) === 0);
assert(swimInWater([[7]]) === 7);
assert(swimInWater([[0,1],[3,2]]) === 2);
console.log('all tests pass');
