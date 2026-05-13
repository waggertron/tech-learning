function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function partitionLabels(s: string): number[] {
    const first = new Map<string, number>();
    const last = new Map<string, number>();
    for (let i = 0; i < s.length; i++) {
        if (!first.has(s[i])) first.set(s[i], i);
        last.set(s[i], i);
    }
    const intervals: [number, number][] = [];
    for (const ch of first.keys()) {
        intervals.push([first.get(ch)!, last.get(ch)!]);
    }
    intervals.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const [a, b] of intervals) {
        if (merged.length > 0 && a <= merged[merged.length - 1][1]) {
            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], b);
        } else {
            merged.push([a, b]);
        }
    }
    return merged.map(([a, b]) => b - a + 1);
}

const eq = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);
assert(eq(partitionLabels('ababcbacadefegdehijhklij'), [9, 7, 8]));
assert(eq(partitionLabels('eccbbbbdec'), [10]));
assert(eq(partitionLabels('a'), [1]));
assert(eq(partitionLabels('abcd'), [1, 1, 1, 1]));
assert(eq(partitionLabels('aabb'), [2, 2]));
console.log("all tests pass");
