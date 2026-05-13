function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function sumSubarrayMins(arr: number[]): number {
    const MOD = 1_000_000_007n;
    const n = arr.length;
    const left = new Array(n).fill(0);
    const right = new Array(n).fill(0);
    let stack: number[] = [];

    for (let i = 0; i < n; i++) {
        while (stack.length && arr[stack[stack.length - 1]] >= arr[i])
            stack.pop();
        left[i] = stack.length ? i - stack[stack.length - 1] : i + 1;
        stack.push(i);
    }

    stack = [];
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length && arr[stack[stack.length - 1]] > arr[i])
            stack.pop();
        right[i] = stack.length ? stack[stack.length - 1] - i : n - i;
        stack.push(i);
    }

    let total = 0n;
    for (let i = 0; i < n; i++)
        total = (total + BigInt(arr[i]) * BigInt(left[i]) * BigInt(right[i])) % MOD;
    return Number(total);
}

assert(sumSubarrayMins([3, 1, 2, 4]) === 17);
assert(sumSubarrayMins([11, 81, 94, 43, 3]) === 444);
assert(sumSubarrayMins([3]) === 3);
console.log('all tests pass');
