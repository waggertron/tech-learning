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

    // Pop top then push val in one sift -- like heapreplace
    replace(val: number): void {
        this.data[0] = val;
        this._siftDown(0);
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

class KthLargest {
    private heap = new MinHeap();
    private k: number;

    constructor(k: number, nums: number[]) {
        this.k = k;
        for (const x of nums) this.add(x);   // L1: O(log k) per initial element
    }

    add(val: number): number {
        if (this.heap.size < this.k) {
            this.heap.push(val);              // L2: O(log k) push
        } else if (val > this.heap.top) {
            this.heap.replace(val);           // L3: O(log k) pop+push atomic
        }
        return this.heap.top;               // L4: O(1) peek top
    }
}

const kl = new KthLargest(3, [4, 5, 8, 2]);
assert(kl.add(3) === 4);
assert(kl.add(5) === 5);
assert(kl.add(10) === 5);
assert(kl.add(9) === 8);
assert(kl.add(4) === 8);

const kl2 = new KthLargest(1, []);
assert(kl2.add(3) === 3);
assert(kl2.add(5) === 5);
assert(kl2.add(1) === 5);

const kl3 = new KthLargest(2, [1, 2]);
assert(kl3.add(0) === 1);
assert(kl3.add(3) === 2);

console.log("all tests pass");
