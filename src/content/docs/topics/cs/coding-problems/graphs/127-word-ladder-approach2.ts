function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
    if (!wordList.includes(endWord)) return 0;
    const L = beginWord.length;
    const patterns = new Map<string, string[]>();
    for (const w of wordList) {
        for (let i = 0; i < L; i++) {
            const key = w.slice(0, i) + '*' + w.slice(i + 1);
            if (!patterns.has(key)) patterns.set(key, []);
            patterns.get(key)!.push(w);
        }
    }
    const q: [string, number][] = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    let head = 0;
    while (head < q.length) {
        const [word, dist] = q[head++];
        if (word === endWord) return dist;
        for (let i = 0; i < L; i++) {
            const key = word.slice(0, i) + '*' + word.slice(i + 1);
            for (const nb of (patterns.get(key) ?? [])) {
                if (!visited.has(nb)) {
                    visited.add(nb);
                    q.push([nb, dist + 1]);
                }
            }
            patterns.set(key, []);
        }
    }
    return 0;
}

assert(ladderLength('hit', 'cog', ['hot','dot','dog','lot','log','cog']) === 5);
assert(ladderLength('hit', 'cot', ['hot','dot','dog','lot','log','cog']) === 0);
assert(ladderLength('hot', 'dot', ['dot','lot']) === 2);
assert(ladderLength('hit', 'cog', ['hot','dot','dog','lot','log']) === 0);
assert(ladderLength('a', 'c', ['a','b','c']) === 2);
console.log('all tests pass');
