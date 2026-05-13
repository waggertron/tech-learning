function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

const INT_MIN = -(2 ** 31);
const INT_MAX = 2 ** 31 - 1;

function reverse(x: number): number {
    const sign = x < 0 ? -1 : 1;           // L1: O(1)
    x = Math.abs(x);                        // L2: O(1)
    let result = 0;
    while (x) {                             // L3: loop d times (d = digits)
        const digit = x % 10;               // L4: O(1)
        x = Math.floor(x / 10);            // L5: O(1)
        if (sign === 1 && (result > Math.floor(INT_MAX / 10) || (result === Math.floor(INT_MAX / 10) && digit > 7)))
            return 0;                       // L6: O(1) overflow guard
        if (sign === -1 && (result > Math.floor(-INT_MIN / 10) || (result === Math.floor(-INT_MIN / 10) && digit > 8)))
            return 0;                       // L7: O(1) overflow guard
        result = result * 10 + digit;       // L8: O(1)
    }
    return sign * result;
}

assert(reverse(123) === 321);
assert(reverse(-123) === -321);
assert(reverse(120) === 21);
assert(reverse(0) === 0);
assert(reverse(2 ** 31 - 1) === 0);
assert(reverse(1534236469) === 0);
console.log("all tests pass");
