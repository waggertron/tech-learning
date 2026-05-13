function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function exist(board: string[][], word: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    const b = (): string[][] => [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']];
    assert(exist(b(), 'ABCCED') === true);
    assert(exist(b(), 'SEE') === true);
    assert(exist(b(), 'ABCB') === false);
    assert(exist([['A']], 'A') === true);
    assert(exist([['A']], 'B') === false);
    // perf
    const bigBoard: string[][] = [
        ['A','B','C','D','E','F','G','H','I','J'],
        ['K','L','M','N','O','P','Q','R','S','T'],
        ['U','V','W','X','Y','Z','A','B','C','D'],
        ['E','F','G','H','I','J','K','L','M','N'],
        ['O','P','Q','R','S','T','U','V','W','X'],
        ['Y','Z','A','B','C','D','E','F','G','H'],
        ['I','J','K','L','M','N','O','P','Q','R'],
        ['S','T','U','V','W','X','Y','Z','A','B'],
        ['C','D','E','F','G','H','I','J','K','L'],
        ['M','N','O','P','Q','R','S','T','U','V'],
    ];
    const t0 = performance.now();
    exist(bigBoard, 'ABCD');
    console.log(`perf exist(10x10 grid, word="ABCD"): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
