function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function checkInclusion(s1: string, s2: string): boolean {
    const n = s1.length, m = s2.length;
    if (n > m) return false;
    const target = new Map<string, number>();           // L1: O(n)
    for (const ch of s1) target.set(ch, (target.get(ch) ?? 0) + 1);
    const window = new Map<string, number>();           // L2: O(n) initial window
    for (let i = 0; i < n; i++) {
        const ch = s2[i];
        window.set(ch, (window.get(ch) ?? 0) + 1);
    }
    const mapsEqual = (a: Map<string, number>, b: Map<string, number>) => {
        if (a.size !== b.size) return false;
        for (const [k, v] of a) if (b.get(k) !== v) return false;
        return true;
    };
    if (mapsEqual(window, target)) return true;        // L3: O(k) compare
    for (let i = n; i < m; i++) {                      // L4: slide m - n steps
        window.set(s2[i], (window.get(s2[i]) ?? 0) + 1);       // L5: O(1) add new char
        const outCh = s2[i - n];
        window.set(outCh, window.get(outCh)! - 1);              // L6: O(1) remove old char
        if (window.get(outCh) === 0) window.delete(outCh);      // L7: O(1) cleanup
        if (mapsEqual(window, target)) return true;             // L8: O(k) compare
    }
    return false;
}

assert(checkInclusion('ab', 'eidbaooo') === true);
assert(checkInclusion('ab', 'eidboaoo') === false);
assert(checkInclusion('a', 'a') === true);
assert(checkInclusion('a', 'b') === false);
assert(checkInclusion('abc', 'ab') === false);
assert(checkInclusion('aab', 'aabc') === true);
console.log('all tests pass');
