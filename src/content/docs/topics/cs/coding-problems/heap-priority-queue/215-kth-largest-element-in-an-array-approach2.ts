function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class MinHeap {
    private data: number[] = [];

    get size(): number { return this.data.length; }
    get top(): number { return this.data[0]; }

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

    private _siftUp(i: number): void {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p] <= this.data[i]) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }

    private _siftDown(i: number): void {
        const n = this.data.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.data[l] < this.data[smallest]) smallest = l;
            if (r < n && this.data[r] < this.data[smallest]) smallest = r;
            if (smallest === i) break;
            [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
            i = smallest;
        }
    }
}

function findKthLargest(nums: number[], k: number): number {
    const heap = new MinHeap();
    for (const x of nums) {       // L1: iterate n elements
        heap.push(x);              // L2: O(log k) push
        if (heap.size > k)
            heap.pop();            // L3: O(log k) pop to keep size k
    }
    return heap.top;
}

assert(findKthLargest([3, 2, 1, 5, 6, 4], 2) === 5);
assert(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) === 4);
assert(findKthLargest([1], 1) === 1);
assert(findKthLargest([2, 2, 2, 2], 2) === 2);
assert(findKthLargest([5, 3, 1, 4, 2], 5) === 1);
console.log("all tests pass");
