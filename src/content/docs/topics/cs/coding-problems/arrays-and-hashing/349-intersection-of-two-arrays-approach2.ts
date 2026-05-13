function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function intersection(nums1: number[], nums2: number[]): number[] {
    const s1 = new Set(nums1);          // L1: O(m) build set from nums1
    const s2 = new Set(nums2);          // L2: O(n) build set from nums2
    return [...s1].filter(x => s2.has(x));  // L3: O(min(m,n)) intersection
}

assert(JSON.stringify([...intersection([1,2,2,1], [2,2])].sort((a,b)=>a-b)) === JSON.stringify([2]));
assert(JSON.stringify([...intersection([4,9,5], [9,4,9,8,4])].sort((a,b)=>a-b)) === JSON.stringify([4,9]));
assert(JSON.stringify(intersection([1,2,3], [4,5,6])) === JSON.stringify([]));
assert(JSON.stringify([...intersection([1,1,1], [1,1,1])].sort((a,b)=>a-b)) === JSON.stringify([1]));
assert(JSON.stringify([...intersection([1,2,3,4,5], [3,4,5,6,7])].sort((a,b)=>a-b)) === JSON.stringify([3,4,5]));
console.log("all tests pass");
