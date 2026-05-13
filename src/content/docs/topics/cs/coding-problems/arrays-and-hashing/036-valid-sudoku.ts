function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isValidSudoku(board: string[][]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    const validBoard = [
        ['5','3','.','.','7','.','.','.','.'],
        ['6','.','.','1','9','5','.','.','.'],
        ['.','9','8','.','.','.','.','6','.'],
        ['8','.','.','.','6','.','.','.','3'],
        ['4','.','.','8','.','3','.','.','1'],
        ['7','.','.','.','2','.','.','.','6'],
        ['.','6','.','.','.','.','2','8','.'],
        ['.','.','.','4','1','9','.','.','5'],
        ['.','.','.','.','8','.','.','7','9'],
    ];
    assert(isValidSudoku(validBoard) === true);

    const dupRow = [
        ['8','3','.','.','7','.','.','.','.'],
        ['6','.','.','1','9','5','.','.','.'],
        ['.','9','8','.','.','.','.','6','.'],
        ['8','.','.','.','6','.','.','.','3'],
        ['4','.','.','8','.','3','.','.','1'],
        ['7','.','.','.','2','.','.','.','6'],
        ['.','6','.','.','.','.','2','8','.'],
        ['.','.','.','4','1','9','.','.','5'],
        ['.','.','.','.','8','.','.','7','9'],
    ];
    assert(isValidSudoku(dupRow) === false);

    const empty = Array.from({ length: 9 }, () => Array(9).fill('.'));
    assert(isValidSudoku(empty) === true);
    // perf
    const t0 = performance.now();
    isValidSudoku(Array.from({ length: 9 }, () => Array(9).fill('.')));
    console.log(`perf isValidSudoku 9x9 empty board: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
