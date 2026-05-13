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

function leastInterval(tasks: string[], n: number): number {
    const freq = new Map<string, number>();
    for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);

    const heap = new MaxHeap();
    for (const c of freq.values()) heap.push(c);  // L1: O(t) build heap

    // cooldown queue: [readyTime, remainingCount]
    const cooldown: Array<[number, number]> = [];
    let time = 0;

    while (heap.size > 0 || cooldown.length > 0) {  // L2: T iterations
        time++;
        if (heap.size > 0) {
            const c = heap.pop() - 1;               // L3: O(log t) pop
            if (c > 0)
                cooldown.push([time + n, c]);        // L4: O(1) enqueue
        }
        if (cooldown.length > 0 && cooldown[0][0] === time) {
            const [, c] = cooldown.shift()!;
            heap.push(c);                            // L5: O(log t) push
        }
    }
    return time;
}

assert(leastInterval(['A','A','A','B','B','B'], 2) === 8);
assert(leastInterval(['A','A','A','B','B','B'], 0) === 6);
assert(leastInterval(['A','A','A','A','A','A','B','C','D','E','F','G'], 2) === 16);
assert(leastInterval(['A','B','C','D','A','B','C','D'], 2) === 8);
assert(leastInterval(['A','A','A'], 3) === 9);
assert(leastInterval(['A','A','A'], 0) === 3);
console.log("all tests pass");
