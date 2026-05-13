function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap backed by a sorted array (small n). For large n use a proper heap library.
function minMeetingRooms(intervals: number[][]): number {
    intervals.sort((a, b) => a[0] - b[0]);
    const heap: number[] = []; // end times, kept sorted ascending

    const heapPush = (val: number) => {
        heap.push(val);
        heap.sort((a, b) => a - b);
    };
    const heapPop = () => heap.shift()!;

    for (const [s, e] of intervals) {
        if (heap.length > 0 && heap[0] <= s) heapPop();
        heapPush(e);
    }
    return heap.length;
}

assert(minMeetingRooms([[0,30],[5,10],[15,20]]) === 2);
assert(minMeetingRooms([[7,10],[2,4]]) === 1);
assert(minMeetingRooms([[1,5]]) === 1);
assert(minMeetingRooms([]) === 0);
assert(minMeetingRooms([[1,4],[2,5],[3,6]]) === 3);
assert(minMeetingRooms([[0,5],[5,10],[10,15]]) === 1);
console.log("all tests pass");
