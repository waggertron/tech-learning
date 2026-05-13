function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function characterReplacement(s: string, k: number): number {
    const counts = new Map<string, number>();
    let left = 0;
    let maxFreq = 0;
    let best = 0;
    for (let right = 0; right < s.length; right++) {    // L1: outer loop, n iterations
        const ch = s[right];
        counts.set(ch, (counts.get(ch) ?? 0) + 1);      // L2: O(1)
        maxFreq = Math.max(maxFreq, counts.get(ch)!);   // L3: O(1) running max
        while ((right - left + 1) - maxFreq > k) {     // L4: shrink if too many replacements
            counts.set(s[left], counts.get(s[left])! - 1);  // L5: O(1)
            left++;                                     // L6: O(1)
        }
        best = Math.max(best, right - left + 1);        // L7: O(1)
    }
    return best;
}

assert(characterReplacement('ABAB', 2) === 4);
assert(characterReplacement('AABABBA', 1) === 4);
assert(characterReplacement('A', 0) === 1);
assert(characterReplacement('AAAA', 2) === 4);
assert(characterReplacement('ABCDE', 1) === 2);
assert(characterReplacement('AABBA', 2) === 5);
console.log('all tests pass');
