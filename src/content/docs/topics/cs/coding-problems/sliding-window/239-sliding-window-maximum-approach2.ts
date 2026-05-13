function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap backed by array (stores [-value, index] pairs for max-heap semantics)
class MinHeap {
    private data: [number, number][] = [];

    push(val: [number, number]): void {
        this.data.push(val);
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

    peek(): [number, number] { return this.data[0]; }
    get size(): number { return this.data.length; }

    private _bubbleUp(i: number): void {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.data[parent][0] <= this.data[i][0]) break;
            [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
            i = parent;
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

function maxSlidingWindow(nums: number[], k: number): number[] {
    const heap = new MinHeap();
    const result: number[] = [];
    for (let i = 0; i < nums.length; i++) {   // L1: outer loop, n iterations
        heap.push([-nums[i], i]);               // L2: O(log n) push
        if (i >= k - 1) {
            while (heap.peek()[1] <= i - k) {  // L3: lazy eviction loop
                heap.pop();                    // L4: O(log n) per eviction
            }
            result.push(-heap.peek()[0]);      // L5: O(1) read top
        }
    }
    return result;
}

assert(JSON.stringify(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)) === JSON.stringify([3, 3, 5, 5, 6, 7]));
assert(JSON.stringify(maxSlidingWindow([1], 1)) === JSON.stringify([1]));
assert(JSON.stringify(maxSlidingWindow([1, -1], 1)) === JSON.stringify([1, -1]));
assert(JSON.stringify(maxSlidingWindow([9, 8, 7, 6, 5], 3)) === JSON.stringify([9, 8, 7]));
assert(JSON.stringify(maxSlidingWindow([1, 2, 3, 4, 5], 3)) === JSON.stringify([3, 4, 5]));
console.log('all tests pass');
