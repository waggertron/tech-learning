function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function jump(nums: number[]): number {
    const n = nums.length;
    if (n <= 1) return 0;
    const visited: boolean[] = new Array(n).fill(false);
    visited[0] = true;
    let level = 0;
    let frontier: number[] = [0];
    while (frontier.length > 0) {
        level++;
        const nextFrontier: number[] = [];
        for (const i of frontier) {
            for (let k = 1; k <= nums[i]; k++) {
                const j = i + k;
                if (j >= n - 1) return level;
                if (!visited[j]) {
                    visited[j] = true;
                    nextFrontier.push(j);
                }
            }
        }
        frontier = nextFrontier;
    }
    return -1;
}

assert(jump([2, 3, 1, 1, 4]) === 2);
assert(jump([2, 3, 0, 1, 4]) === 2);
assert(jump([1]) === 0);
assert(jump([1, 1, 1, 1]) === 3);
assert(jump([5, 4, 3, 2, 1, 0]) === 1);
console.log("all tests pass");
