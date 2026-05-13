function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function normalize(result: string[][]): string[][] {
    return result.map(g => [...g].sort()).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
}

function groupAnagrams(strs: string[]): string[][] {
    const groups = new Map<string, string[]>();
    for (const s of strs) {
        const key = s.split('').sort().join('');    // L3: O(k log k) sort + O(k) join
        if (!groups.has(key)) groups.set(key, []); // L4: O(1) avg hash lookup/insert
        groups.get(key)!.push(s);                  // L4: O(1) avg append
    }
    return Array.from(groups.values());             // L5: O(n) to collect
}

assert(JSON.stringify(normalize(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']))) === JSON.stringify([['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]));
assert(JSON.stringify(normalize(groupAnagrams(['']))) === JSON.stringify([['']]));
assert(JSON.stringify(normalize(groupAnagrams(['a']))) === JSON.stringify([['a']]));
assert(JSON.stringify(normalize(groupAnagrams(['abc', 'bca', 'cab']))) === JSON.stringify([['abc', 'bca', 'cab']]));
assert(JSON.stringify(normalize(groupAnagrams(['a', 'b', 'c']))) === JSON.stringify([['a'], ['b'], ['c']]));
console.log("all tests pass");
