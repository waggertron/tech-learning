function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function leastInterval(tasks: string[], n: number): number {
    const freq = new Map<string, number>();
    for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);  // L1: O(T) build counter

    let maxCount = 0;
    for (const c of freq.values()) if (c > maxCount) maxCount = c;  // L2: O(t) find max

    let ties = 0;
    for (const c of freq.values()) if (c === maxCount) ties++;       // L3: O(t) count ties

    return Math.max(tasks.length, (maxCount - 1) * (n + 1) + ties); // L4: O(1) formula
}

assert(leastInterval(['A','A','A','B','B','B'], 2) === 8);
assert(leastInterval(['A','A','A','B','B','B'], 0) === 6);
assert(leastInterval(['A','A','A','A','A','A','B','C','D','E','F','G'], 2) === 16);
assert(leastInterval(['A','B','C','D','A','B','C','D'], 2) === 8);
assert(leastInterval(['A','A','A'], 3) === 9);
assert(leastInterval(['A','A','A'], 0) === 3);
console.log("all tests pass");
