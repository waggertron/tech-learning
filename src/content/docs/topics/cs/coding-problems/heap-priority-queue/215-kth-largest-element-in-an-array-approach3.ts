function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findKthLargest(nums: number[], k: number): number {
    const arr = nums.slice(); // avoid mutating input
    const target = arr.length - k;

    function partition(lo: number, hi: number): [number, number] {
        const pivotIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
        const pivot = arr[pivotIdx];  // L1: random pivot
        let left = lo, right = hi, i = lo;
        while (i <= right) {          // L2: three-way partition
            if (arr[i] < pivot) {
                [arr[left], arr[i]] = [arr[i], arr[left]];
                left++; i++;
            } else if (arr[i] > pivot) {
                [arr[right], arr[i]] = [arr[i], arr[right]];
                right--;
            } else {
                i++;
            }
        }
        return [left, right];
    }

    let lo = 0, hi = arr.length - 1;
    while (true) {
        if (lo === hi) return arr[lo];
        const [l, r] = partition(lo, hi);   // L3: O(hi - lo) per call
        if (l <= target && target <= r) return arr[target];
        else if (target < l) hi = l - 1;
        else lo = r + 1;
    }
}

assert(findKthLargest([3, 2, 1, 5, 6, 4], 2) === 5);
assert(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) === 4);
assert(findKthLargest([1], 1) === 1);
assert(findKthLargest([2, 2, 2, 2], 2) === 2);
assert(findKthLargest([5, 3, 1, 4, 2], 5) === 1);
console.log("all tests pass");
