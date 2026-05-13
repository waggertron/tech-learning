function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function repeatedSubstringPattern(s: string): boolean {
    const doubled = (s + s).slice(1, -1);  // L1: O(n) concatenate and slice
    return doubled.includes(s);             // L2: O(n) substring search
}

assert(repeatedSubstringPattern("abab") === true);
assert(repeatedSubstringPattern("aba") === false);
assert(repeatedSubstringPattern("abcabcabcabc") === true);
assert(repeatedSubstringPattern("a") === false);
assert(repeatedSubstringPattern("aa") === true);
assert(repeatedSubstringPattern("abaaba") === true);
console.log("all tests pass");
