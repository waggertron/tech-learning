function rotate(nums: number[], k: number): void {
}

const nums1 = [1, 2, 3, 4, 5, 6, 7];
rotate(nums1, 3);
console.log(nums1);  // [5, 6, 7, 1, 2, 3, 4]

const nums2 = [-1, -100, 3, 99];
rotate(nums2, 2);
console.log(nums2);  // [3, 99, -1, -100]
