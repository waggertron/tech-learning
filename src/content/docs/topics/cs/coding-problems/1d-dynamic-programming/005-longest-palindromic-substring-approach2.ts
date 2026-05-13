function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestPalindrome(s: string): string {
    function expand(l: number, r: number): string {
        while (l >= 0 && r < s.length && s[l] === s[r]) {
            l--;
            r++;
        }
        return s.slice(l + 1, r);
    }

    let best = '';
    for (let i = 0; i < s.length; i++) {
        for (const cand of [expand(i, i), expand(i, i + 1)]) {
            if (cand.length > best.length) best = cand;
        }
    }
    return best;
}

assert(['bab', 'aba'].includes(longestPalindrome('babad')));
assert(longestPalindrome('cbbd') === 'bb');
assert(longestPalindrome('a') === 'a');
assert(['a', 'c'].includes(longestPalindrome('ac')));
assert(longestPalindrome('racecar') === 'racecar');
assert(longestPalindrome('abacaba') === 'abacaba');
console.log("all tests pass");
