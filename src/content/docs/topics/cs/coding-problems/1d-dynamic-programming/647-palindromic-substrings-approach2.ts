function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function countSubstrings(s: string): number {
    function expand(l: number, r: number): number {
        let count = 0;
        while (l >= 0 && r < s.length && s[l] === s[r]) {
            count++;
            l--;
            r++;
        }
        return count;
    }
    let total = 0;
    for (let i = 0; i < s.length; i++) {
        total += expand(i, i) + expand(i, i + 1);
    }
    return total;
}

assert(countSubstrings('abc') === 3);
assert(countSubstrings('aaa') === 6);
assert(countSubstrings('a') === 1);
assert(countSubstrings('aa') === 3);
assert(countSubstrings('abba') === 6);
assert(countSubstrings('racecar') === 10);
console.log("all tests pass");
