function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    const m = nums1.length, n = nums2.length;
    const total = m + n;
    const need = Math.floor(total / 2) + 1;

    let i = 0, j = 0;
    let prev = 0, cur = 0;
    for (let step = 0; step < need; step++) {
        prev = cur;
        if (i < m && (j >= n || nums1[i] <= nums2[j])) {
            cur = nums1[i++];
        } else {
            cur = nums2[j++];
        }
    }
    return total % 2 === 1 ? cur : (prev + cur) / 2;
}

assert(findMedianSortedArrays([1, 3], [2]) === 2.0);
assert(findMedianSortedArrays([1, 2], [3, 4]) === 2.5);
assert(findMedianSortedArrays([0, 0], [0, 0]) === 0.0);
assert(findMedianSortedArrays([], [1]) === 1.0);
assert(findMedianSortedArrays([2], []) === 2.0);
assert(findMedianSortedArrays([1, 3], [2, 4]) === 2.5);
console.log("all tests pass");
