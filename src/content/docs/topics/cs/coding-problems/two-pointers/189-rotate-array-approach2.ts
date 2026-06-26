function rotate(nums: number[], k: number): void {
    const n = nums.length;
    k %= n;
    const reverse = (lo: number, hi: number): void => {
        while (lo < hi) {
            [nums[lo], nums[hi]] = [nums[hi], nums[lo]];
            lo++;
            hi--;
        }
    };
    reverse(0, n - 1);   // whole array reversed
    reverse(0, k - 1);   // fix first k
    reverse(k, n - 1);   // fix the rest
}

const nums1 = [1, 2, 3, 4, 5, 6, 7];
rotate(nums1, 3);
console.log(nums1);  // [5, 6, 7, 1, 2, 3, 4]
