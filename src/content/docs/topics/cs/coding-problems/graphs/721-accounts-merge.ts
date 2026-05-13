function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function accountsMerge(accounts: string[][]): string[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    function normalize(result: string[][]): string {
        return JSON.stringify(result.map(row => [row[0], ...row.slice(1).sort()]).sort());
    }

    const a1 = [
        ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
        ['John', 'johnsmith@mail.com', 'john00@mail.com'],
        ['Mary', 'mary@mail.com'],
        ['John', 'johnnybravo@mail.com'],
    ];
    const expected1 = [
        ['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com'],
        ['Mary', 'mary@mail.com'],
        ['John', 'johnnybravo@mail.com'],
    ];
    assert(normalize(accountsMerge(a1)) === normalize(expected1));

    const a2 = [['Alice', 'a@x.com']];
    assert(normalize(accountsMerge(a2)) === normalize([['Alice', 'a@x.com']]));

    const a3 = [['A', 'x@y.com', 'a@b.com'], ['A', 'x@y.com', 'c@d.com']];
    assert(normalize(accountsMerge(a3)) === normalize([['A', 'a@b.com', 'c@d.com', 'x@y.com']]));

    // perf
    const big = Array.from({ length: 10_000 }, (_, i) => [`User${i}`, `email${i}@x.com`, 'shared@x.com']);
    const t0 = performance.now();
    accountsMerge(big);
    console.log(`perf accounts-merge 10000 accounts sharing one email: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
