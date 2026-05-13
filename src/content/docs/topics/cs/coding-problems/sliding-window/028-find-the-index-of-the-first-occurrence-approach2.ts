function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function strStr(haystack: string, needle: string): number {
    return haystack.indexOf(needle);
}

assert(strStr('sadbutsad', 'sad') === 0);
assert(strStr('leetcode', 'leeto') === -1);
assert(strStr('hello', 'll') === 2);
assert(strStr('a', 'a') === 0);
assert(strStr('mississippi', 'issip') === 4);
assert(strStr('abc', '') === 0);
assert(strStr('', 'a') === -1);
console.log('all tests pass');
