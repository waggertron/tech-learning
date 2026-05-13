function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minWindow(s: string, t: string): string {
    if (!s || !t) return '';
    const need = new Map<string, number>();                // L1: O(|t|)
    for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
    const needed = need.size;                             // L2: O(1)
    const window = new Map<string, number>();             // L3: O(1)
    let have = 0;                                         // L4: O(1)
    let left = 0;
    let bestLen = Infinity, bestL = 0, bestR = 0;         // L5: O(1)

    for (let right = 0; right < s.length; right++) {     // L6: outer loop, n iterations
        const ch = s[right];
        window.set(ch, (window.get(ch) ?? 0) + 1);       // L7: O(1)
        if (need.has(ch) && window.get(ch) === need.get(ch)) {  // L8: O(1)
            have++;                                       // L9: O(1)
        }
        while (have === needed) {                         // L10: O(1) guard; shrink loop
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;               // L11: O(1)
                bestL = left; bestR = right;
            }
            const lch = s[left];
            window.set(lch, window.get(lch)! - 1);       // L12: O(1)
            if (need.has(lch) && window.get(lch)! < need.get(lch)!) {
                have--;                                   // L13: O(1)
            }
            left++;                                       // L14: O(1)
        }
    }
    return bestLen === Infinity ? '' : s.slice(bestL, bestR + 1);
}

assert(minWindow('ADOBECODEBANC', 'ABC') === 'BANC');
assert(minWindow('a', 'a') === 'a');
assert(minWindow('a', 'aa') === '');
assert(minWindow('', 'a') === '');
assert(minWindow('abc', '') === '');
assert(minWindow('aa', 'aa') === 'aa');
console.log('all tests pass');
