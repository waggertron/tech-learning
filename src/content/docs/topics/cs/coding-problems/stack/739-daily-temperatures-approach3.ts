function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function dailyTemperatures(temperatures: number[]): number[] {
    const n = temperatures.length;
    const answer = new Array(n).fill(0);
    const stack: number[] = [];
    for (let i = 0; i < n; i++) {
        while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
            const j = stack.pop()!;
            answer[j] = i - j;
        }
        stack.push(i);
    }
    return answer;
}

assert(JSON.stringify(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])) === JSON.stringify([1, 1, 4, 2, 1, 1, 0, 0]));
assert(JSON.stringify(dailyTemperatures([30, 40, 50, 60])) === JSON.stringify([1, 1, 1, 0]));
assert(JSON.stringify(dailyTemperatures([30, 60, 90])) === JSON.stringify([1, 1, 0]));
assert(JSON.stringify(dailyTemperatures([90, 60, 30])) === JSON.stringify([0, 0, 0]));
assert(JSON.stringify(dailyTemperatures([70])) === JSON.stringify([0]));
console.log('all tests pass');
