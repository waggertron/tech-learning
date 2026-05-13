function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    const counts = new Map<string, number>();
    for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
    for (const ch of t) {
        const c = counts.get(ch);
        if (!c) return false;
        counts.set(ch, c - 1);
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
