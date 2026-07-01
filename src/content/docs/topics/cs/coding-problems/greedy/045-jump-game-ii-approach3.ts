function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function jump(nums: number[]): number {
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }
    return jumps;
}

assert(jump([2, 3, 1, 1, 4]) === 2);
assert(jump([2, 3, 0, 1, 4]) === 2);
assert(jump([1]) === 0);
assert(jump([1, 1, 1, 1]) === 3);
assert(jump([5, 4, 3, 2, 1, 0]) === 1);
console.log("all tests pass");
