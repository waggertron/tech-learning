function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function partition(s: string): string[][] {
    const n = s.length;
    // isPal[i][j] = true iff s[i..j] is a palindrome
    const isPal: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    for (let i = 0; i < n; i++) isPal[i][i] = true;         // L1: single chars
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (s[i] === s[j] && (len === 2 || isPal[i + 1][j - 1]))
                isPal[i][j] = true;                          // L2: O(1) DP recurrence
        }
    }

    const result: string[][] = [];
    const path: string[] = [];

    function backtrack(start: number): void {
        if (start === n) {
            result.push([...path]);                          // L3: O(n) copy
            return;
        }
        for (let end = start; end < n; end++) {
            if (isPal[start][end]) {                         // L4: O(1) table lookup
                path.push(s.slice(start, end + 1));          // L5: O(k) slice for result
                backtrack(end + 1);                          // L6: recurse
                path.pop();
            }
        }
    }

    backtrack(0);
    return result;
}

const norm = (arr: string[][]): string =>
    JSON.stringify(arr.map(a => [...a]).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));

const r = partition('aab');
assert(norm(r) === norm([['a','a','b'],['aa','b']]));
assert(JSON.stringify(partition('a')) === JSON.stringify([['a']]));
const r3 = partition('aaa');
assert(norm(r3) === norm([['a','a','a'],['a','aa'],['aa','a'],['aaa']]));
const r4 = partition('abc');
assert(norm(r4) === norm([['a','b','c']]));
console.log('all tests pass');
