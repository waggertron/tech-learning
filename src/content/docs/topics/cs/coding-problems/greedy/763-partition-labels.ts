function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function partitionLabels(s: string): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const eq = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);
    assert(eq(partitionLabels('ababcbacadefegdehijhklij'), [9, 7, 8]));
    assert(eq(partitionLabels('eccbbbbdec'), [10]));
    assert(eq(partitionLabels('a'), [1]));
    assert(eq(partitionLabels('abcd'), [1, 1, 1, 1]));
    assert(eq(partitionLabels('aabb'), [2, 2]));
    // perf
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const big = (alpha.repeat(385)).slice(0, 10000);
    const t0 = performance.now();
    partitionLabels(big);
    console.log(`perf partitionLabels(n=10000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
