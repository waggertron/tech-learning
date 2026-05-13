function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function multiply(num1: string, num2: string): string {
    if (num1 === '0' || num2 === '0') return '0';          // L1: O(1) early exit
    const n = num1.length, m = num2.length;                // L2: O(1)
    const result = new Array(n + m).fill(0);               // L3: O(n + m)
    for (let i = n - 1; i >= 0; i--) {                    // L4: outer loop, n iterations
        for (let j = m - 1; j >= 0; j--) {                // L5: inner loop, m iterations
            const prod = +num1[i] * +num2[j];              // L6: O(1)
            const p1 = i + j, p2 = i + j + 1;             // L7: O(1)
            const total = prod + result[p2];               // L8: O(1)
            result[p2] = total % 10;                       // L9: O(1)
            result[p1] += Math.floor(total / 10);          // L10: O(1)
        }
    }
    let start = 0;
    while (start < result.length && result[start] === 0) start++;  // L11: O(n + m)
    return result.slice(start).join('') || '0';            // L12: O(n + m)
}

assert(multiply('2', '3') === '6');
assert(multiply('123', '456') === '56088');
assert(multiply('0', '12345') === '0');
assert(multiply('99', '99') === '9801');
assert(multiply('1', '1') === '1');
assert(multiply('9999', '9999') === '99980001');
console.log('all tests pass');
