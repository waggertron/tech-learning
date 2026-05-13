function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
    const m = nums1.length, n = nums2.length;
    const half = Math.floor((m + n + 1) / 2);

    let lo = 0, hi = m;
    while (lo <= hi) {
        const i = (lo + hi) >> 1;
        const j = half - i;

        const aLeft  = i > 0 ? nums1[i - 1] : -Infinity;
        const aRight = i < m ? nums1[i]     :  Infinity;
        const bLeft  = j > 0 ? nums2[j - 1] : -Infinity;
        const bRight = j < n ? nums2[j]     :  Infinity;

        if (aLeft <= bRight && bLeft <= aRight) {
            if ((m + n) % 2 === 1) return Math.max(aLeft, bLeft);
            return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
        } else if (aLeft > bRight) {
            hi = i - 1;
        } else {
            lo = i + 1;
        }
    }
    return 0;
}

assert(findMedianSortedArrays([1, 3], [2]) === 2.0);
assert(findMedianSortedArrays([1, 2], [3, 4]) === 2.5);
assert(findMedianSortedArrays([0, 0], [0, 0]) === 0.0);
assert(findMedianSortedArrays([], [1]) === 1.0);
assert(findMedianSortedArrays([2], []) === 2.0);
assert(findMedianSortedArrays([1, 3], [2, 4]) === 2.5);
console.log("all tests pass");
