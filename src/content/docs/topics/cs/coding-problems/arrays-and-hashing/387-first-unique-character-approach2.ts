function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function firstUniqChar(s: string): number {
    const counts = new Map<string, number>();
    for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);  // L1: O(n) build frequency map
    for (let i = 0; i < s.length; i++) {                              // L2: O(n) second scan
        if (counts.get(s[i]) === 1) return i;                         // L3: O(1) lookup
    }
    return -1;                                                         // L5
}

assert(firstUniqChar("leetcode") === 0);
assert(firstUniqChar("loveleetcode") === 2);
assert(firstUniqChar("aabb") === -1);
assert(firstUniqChar("z") === 0);
assert(firstUniqChar("aab") === 2);
assert(firstUniqChar("cc") === -1);
console.log("all tests pass");
