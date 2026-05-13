function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isPalindrome(s: string): boolean {
    const cleaned = Array.from(s).filter(ch => /[a-z0-9]/i.test(ch)).map(ch => ch.toLowerCase()); // L1: O(n) filter
    let l = 0, r = cleaned.length - 1;                  // L2: O(1) init pointers
    while (l < r) {                                      // L3: at most n/2 iterations
        if (cleaned[l] !== cleaned[r]) return false;     // L4/L5: O(1) compare + early exit
        l++;                                             // L6: O(1) advance both
        r--;
    }
    return true;
}

assert(isPalindrome('A man, a plan, a canal: Panama') === true);
assert(isPalindrome('race a car') === false);
assert(isPalindrome(' ') === true);
assert(isPalindrome('') === true);
assert(isPalindrome('a') === true);
assert(isPalindrome('aa') === true);
assert(isPalindrome('ab') === false);
console.log('all tests pass');
