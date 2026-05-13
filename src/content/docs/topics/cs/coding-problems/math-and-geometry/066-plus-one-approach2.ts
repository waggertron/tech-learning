function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function plusOne(digits: number[]): number[] {
    for (let i = digits.length - 1; i >= 0; i--) {  // L1: walk right to left
        if (digits[i] < 9) {                          // L2: O(1)
            digits[i]++;                              // L3: O(1), no carry needed
            return digits;
        }
        digits[i] = 0;                               // L4: O(1), carry continues
    }
    return [1, ...digits];                           // L5: O(n), all nines case
}

assert(JSON.stringify(plusOne([1, 2, 3])) === JSON.stringify([1, 2, 4]));
assert(JSON.stringify(plusOne([9, 9, 9])) === JSON.stringify([1, 0, 0, 0]));
assert(JSON.stringify(plusOne([0])) === JSON.stringify([1]));
assert(JSON.stringify(plusOne([9])) === JSON.stringify([1, 0]));
assert(JSON.stringify(plusOne([1, 0, 9])) === JSON.stringify([1, 1, 0]));
assert(JSON.stringify(plusOne([4, 3, 2, 1])) === JSON.stringify([4, 3, 2, 2]));
console.log('all tests pass');
