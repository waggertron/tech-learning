function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isPalindrome(s: string): boolean {
    let l = 0, r = s.length - 1;                        // L1: O(1) init pointers
    while (l < r) {                                      // L2: at most n steps total
        while (l < r && !/[a-z0-9]/i.test(s[l])) l++;  // L3/L4: skip non-alnum on left
        while (l < r && !/[a-z0-9]/i.test(s[r])) r--;  // L5/L6: skip non-alnum on right
        if (s[l].toLowerCase() !== s[r].toLowerCase())  // L7: O(1) compare
            return false;                                // L8: O(1) early exit
        l++;                                             // L9: O(1) advance both
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
