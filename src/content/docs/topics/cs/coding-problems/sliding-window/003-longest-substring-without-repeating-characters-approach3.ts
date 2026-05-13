function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function lengthOfLongestSubstring(s: string): number {
    const lastSeen = new Map<string, number>();           // L1: O(1)
    let left = 0;                                        // L2: O(1)
    let best = 0;                                        // L3: O(1)
    for (let right = 0; right < s.length; right++) {    // L4: outer loop, n iterations
        const ch = s[right];
        if (lastSeen.has(ch) && lastSeen.get(ch)! >= left) {  // L5: O(1) map lookup
            left = lastSeen.get(ch)! + 1;               // L6: O(1) jump left
        }
        lastSeen.set(ch, right);                        // L7: O(1) update map
        best = Math.max(best, right - left + 1);        // L8: O(1)
    }
    return best;
}

assert(lengthOfLongestSubstring('abcabcbb') === 3);
assert(lengthOfLongestSubstring('bbbbb') === 1);
assert(lengthOfLongestSubstring('pwwkew') === 3);
assert(lengthOfLongestSubstring('') === 0);
assert(lengthOfLongestSubstring('a') === 1);
assert(lengthOfLongestSubstring('abcdef') === 6);
console.log('all tests pass');
