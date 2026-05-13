function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function partition(s: string): string[][] {
    const result: string[][] = [];
    const path: string[] = [];
    const n = s.length;

    function isPal(l: number, r: number): boolean {
        while (l < r) {
            if (s[l] !== s[r]) return false;
            l++;
            r--;                                   // L1: O(k) two-pointer check
        }
        return true;
    }

    function backtrack(start: number): void {
        if (start === n) {
            result.push([...path]);                // L2: O(n) copy
            return;
        }
        for (let end = start; end < n; end++) {
            if (isPal(start, end)) {
                path.push(s.slice(start, end + 1)); // L3: O(k) slice for result
                backtrack(end + 1);                 // L4: recurse
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
