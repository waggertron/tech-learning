function rotate(nums: number[], k: number): void {
    const n = nums.length;
    k %= n;
    let count = 0;
    for (let start = 0; count < n; start++) {
        let current = start;
        let prev = nums[start];
        do {
            const next = (current + k) % n;
            [nums[next], prev] = [prev, nums[next]];
            current = next;
            count++;
        } while (start !== current);
    }
}

const nums1 = [1, 2, 3, 4, 5, 6, 7];
rotate(nums1, 3);
console.log(nums1);  // [5, 6, 7, 1, 2, 3, 4]
