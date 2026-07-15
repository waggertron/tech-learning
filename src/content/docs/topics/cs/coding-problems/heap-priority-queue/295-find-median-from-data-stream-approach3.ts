function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class MinHeap {
    protected data: number[] = [];

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

    protected _siftUp(i: number): void {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p] <= this.data[i]) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }

    protected _siftDown(i: number): void {
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

class MaxHeap extends MinHeap {
    protected override _siftUp(i: number): void {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p] >= this.data[i]) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }

    protected override _siftDown(i: number): void {
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

class MedianFinder {
    private lo = new MaxHeap(); // smaller half
    private hi = new MinHeap(); // larger half

    addNum(num: number): void {
        this.lo.push(num);                          // L1: O(log n) push to lo
        this.hi.push(this.lo.pop());               // L2: O(log n) pop lo top + push hi
        if (this.hi.size > this.lo.size)
            this.lo.push(this.hi.pop());           // L3: O(log n) rebalance
    }

    findMedian(): number {
        if (this.lo.size > this.hi.size)
            return this.lo.top;                    // L4: O(1) read lo top
        return (this.lo.top + this.hi.top) / 2;   // L5: O(1) average both tops
    }
}

const mf = new MedianFinder();
mf.addNum(1); mf.addNum(2);
assert(mf.findMedian() === 1.5);
mf.addNum(3);
assert(mf.findMedian() === 2.0);

const mf2 = new MedianFinder();
mf2.addNum(42);
assert(mf2.findMedian() === 42.0);

const mf3 = new MedianFinder();
for (const v of [5, 3, 8, 1, 9]) mf3.addNum(v);
assert(mf3.findMedian() === 5.0);

const mf4 = new MedianFinder();
for (const v of [2, 4, 6, 8]) mf4.addNum(v);
assert(mf4.findMedian() === 5.0);

console.log("all tests pass");
