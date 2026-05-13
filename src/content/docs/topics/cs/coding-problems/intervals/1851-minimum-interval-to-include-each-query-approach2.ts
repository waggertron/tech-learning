function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap helpers (keyed by first element of [length, end] pair)
type HeapEntry = [number, number]; // [length, end]

function heapPush(heap: HeapEntry[], entry: HeapEntry): void {
    heap.push(entry);
    let i = heap.length - 1;
    while (i > 0) {
        const parent = (i - 1) >> 1;
        if (heap[parent][0] <= heap[i][0]) break;
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
    }
}

function heapPop(heap: HeapEntry[]): HeapEntry {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
        heap[0] = last;
        let i = 0;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
            if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
            if (smallest === i) break;
            [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
            i = smallest;
        }
    }
    return top;
}

function minInterval(intervals: number[][], queries: number[]): number[] {
    intervals.sort((a, b) => a[0] - b[0]);
    const sortedQueries = queries.map((q, idx) => [q, idx] as [number, number])
        .sort((a, b) => a[0] - b[0]);

    const result = new Array(queries.length).fill(0);
    const heap: HeapEntry[] = [];
    let i = 0;

    for (const [q, origIdx] of sortedQueries) {
        while (i < intervals.length && intervals[i][0] <= q) {
            const [s, e] = intervals[i];
            heapPush(heap, [e - s + 1, e]);
            i++;
        }
        while (heap.length > 0 && heap[0][1] < q) heapPop(heap);
        result[origIdx] = heap.length > 0 ? heap[0][0] : -1;
    }
    return result;
}

assert(JSON.stringify(minInterval([[1,4],[2,4],[3,6],[4,4]], [2,3,4,5])) === JSON.stringify([3,3,1,4]));
assert(JSON.stringify(minInterval([[2,3],[2,5],[1,8],[20,25]], [2,19,5,22])) === JSON.stringify([2,-1,4,6]));
assert(JSON.stringify(minInterval([[1,3]], [5])) === JSON.stringify([-1]));
assert(JSON.stringify(minInterval([[1,10]], [5])) === JSON.stringify([10]));
assert(JSON.stringify(minInterval([[1,5],[2,3]], [2,3])) === JSON.stringify([2,2]));
console.log("all tests pass");
