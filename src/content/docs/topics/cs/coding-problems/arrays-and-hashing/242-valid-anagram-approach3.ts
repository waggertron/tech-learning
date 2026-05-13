function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    const counts = new Array(26).fill(0);
    for (const ch of s) counts[ch.charCodeAt(0) - 97]++;
    for (const ch of t) {
        const idx = ch.charCodeAt(0) - 97;
        counts[idx]--;
        if (counts[idx] < 0) return false;
    }
    return true;
}

assert(isAnagram('anagram', 'nagaram') === true);
assert(isAnagram('rat', 'car') === false);
assert(isAnagram('a', 'a') === true);
assert(isAnagram('ab', 'ba') === true);
assert(isAnagram('ab', 'a') === false);
assert(isAnagram('', '') === true);
console.log("all tests pass");
