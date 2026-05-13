function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function partitionLabels(s: string): number[] {
    const last = new Map<string, number>();
    for (let i = 0; i < s.length; i++) last.set(s[i], i);
    const result: number[] = [];
    let start = 0;
    let end = 0;
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last.get(s[i])!);
        if (i === end) {
            result.push(i - start + 1);
            start = i + 1;
        }
    }
    return result;
}

const eq = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);
assert(eq(partitionLabels('ababcbacadefegdehijhklij'), [9, 7, 8]));
assert(eq(partitionLabels('eccbbbbdec'), [10]));
assert(eq(partitionLabels('a'), [1]));
assert(eq(partitionLabels('abcd'), [1, 1, 1, 1]));
assert(eq(partitionLabels('aabb'), [2, 2]));
console.log("all tests pass");
