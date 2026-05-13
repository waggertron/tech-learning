function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function letterCombinations(digits: string): string[] {
    if (!digits) return [];
    const mapping: Record<string, string> = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz',
    };
    // iterative cartesian product
    let result: string[] = [''];
    for (const d of digits) {                                      // L1: loop over n digits
        const next: string[] = [];
        for (const prefix of result) {
            for (const ch of mapping[d]) {
                next.push(prefix + ch);                            // L2: O(k^n · n) total
            }
        }
        result = next;
    }
    return result;
}

assert(JSON.stringify(letterCombinations('23').sort()) ===
    JSON.stringify(['ad','ae','af','bd','be','bf','cd','ce','cf'].sort()));
assert(JSON.stringify(letterCombinations('')) === JSON.stringify([]));
assert(JSON.stringify(letterCombinations('2').sort()) === JSON.stringify(['a','b','c']));
assert(JSON.stringify(letterCombinations('7').sort()) === JSON.stringify(['p','q','r','s']));
assert(letterCombinations('22').length === 9);
console.log('all tests pass');
