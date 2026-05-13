function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function letterCombinations(digits: string): string[] {
    if (!digits) return [];
    const mapping: Record<string, string> = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz',
    };
    const result: string[] = [];
    const path: string[] = [];

    function backtrack(i: number): void {
        if (i === digits.length) {
            result.push(path.join(''));   // L1: O(n) join when complete
            return;
        }
        for (const ch of mapping[digits[i]]) {  // L2: loop over letters for digit i
            path.push(ch);                        // L3: O(1) push
            backtrack(i + 1);                     // L4: recurse
            path.pop();                           // L5: O(1) pop
        }
    }

    backtrack(0);
    return result;
}

assert(JSON.stringify(letterCombinations('23').sort()) ===
    JSON.stringify(['ad','ae','af','bd','be','bf','cd','ce','cf'].sort()));
assert(JSON.stringify(letterCombinations('') ) === JSON.stringify([]));
assert(JSON.stringify(letterCombinations('2').sort()) === JSON.stringify(['a','b','c']));
assert(JSON.stringify(letterCombinations('7').sort()) === JSON.stringify(['p','q','r','s']));
assert(letterCombinations('22').length === 9);
console.log('all tests pass');
