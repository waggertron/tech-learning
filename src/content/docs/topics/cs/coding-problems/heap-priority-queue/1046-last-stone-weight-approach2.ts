function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class MaxHeap {
    private data: number[] = [];

    get size(): number { return this.data.length; }

    push(val: number): void {
        this.data.push(val);
        this._siftUp(this.data.length - 1);
    }

    pop(): number {
        const top = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            this._siftDown(0);
        }
        return top;
    }

    peek(): number { return this.data[0]; }

    private _siftUp(i: number): void {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p] >= this.data[i]) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }

    private _siftDown(i: number): void {
        const n = this.data.length;
        while (true) {
            let largest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.data[l] > this.data[largest]) largest = l;
            if (r < n && this.data[r] > this.data[largest]) largest = r;
            if (largest === i) break;
            [this.data[largest], this.data[i]] = [this.data[i], this.data[largest]];
            i = largest;
        }
    }
}

function lastStoneWeight(stones: number[]): number {
    const heap = new MaxHeap();
    for (const s of stones) heap.push(s);  // L1+L2: build max-heap O(n)
    while (heap.size > 1) {                // L3: outer loop, up to n-1 rounds
        const y = heap.pop();              // L4: O(log n) per call
        const x = heap.pop();              // L5: O(log n) per call
        if (x !== y)
            heap.push(y - x);             // L6: O(log n) when taken
    }
    return heap.size > 0 ? heap.peek() : 0;
}

assert(lastStoneWeight([2, 7, 4, 1, 8, 1]) === 1);
assert(lastStoneWeight([1]) === 1);
assert(lastStoneWeight([31, 26, 33, 21, 40]) === 9);
assert(lastStoneWeight([9, 3, 2, 10]) === 0);
assert(lastStoneWeight([2, 2]) === 0);
assert(lastStoneWeight([1, 3]) === 2);
console.log("all tests pass");
