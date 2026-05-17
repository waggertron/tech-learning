function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProbability(n: number, edges: number[][], succProb: number[], start: number, end: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(Math.abs(maxProbability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.2], 0, 2) - 0.25) < 1e-5);
    assert(Math.abs(maxProbability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.3], 0, 2) - 0.3) < 1e-5);
    assert(maxProbability(3, [[0,1]], [0.5], 0, 2) === 0.0);
    assert(Math.abs(maxProbability(2, [[0,1]], [0.9], 0, 1) - 0.9) < 1e-5);
    assert(Math.abs(maxProbability(3, [[0,1],[1,2]], [0.5,0.5], 1, 1) - 1.0) < 1e-5);
    // perf
    const pN = 500;
    const pEdges = Array.from({ length: pN }, (_, i) => [i, (i + 1) % pN]);
    let seed = 42;
    const rand = () => { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; };
    const probs = pEdges.map(() => rand());
    const t0 = performance.now();
    maxProbability(pN, pEdges, probs, 0, Math.floor(pN / 2));
    console.log(`perf max_probability on 10000 nodes ring: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
