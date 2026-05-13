function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function normalize(result: string[][]): string[][] {
    return result.map(g => [...g].sort()).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
}

function groupAnagrams(strs: string[]): string[][] {
    const groups = new Map<string, string[]>();
    for (const s of strs) {
        const count = new Array(26).fill(0);         // L3: O(1), fixed 26-slot array
        for (const ch of s) count[ch.charCodeAt(0) - 97]++;  // L4: O(k) char count
        const key = count.join(',');                 // L6: O(26)=O(1) fixed-size key
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
    }
    return Array.from(groups.values());              // L7: O(n) to collect
}

assert(JSON.stringify(normalize(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']))) === JSON.stringify([['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]));
assert(JSON.stringify(normalize(groupAnagrams(['']))) === JSON.stringify([['']]));
assert(JSON.stringify(normalize(groupAnagrams(['a']))) === JSON.stringify([['a']]));
assert(JSON.stringify(normalize(groupAnagrams(['abc', 'bca', 'cab']))) === JSON.stringify([['abc', 'bca', 'cab']]));
assert(JSON.stringify(normalize(groupAnagrams(['a', 'b', 'c']))) === JSON.stringify([['a'], ['b'], ['c']]));
console.log("all tests pass");
