function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function reverseBits(n: number): number {
    return parseInt(n.toString(2).padStart(32, '0').split('').reverse().join(''), 2); // L1: O(32)
}

assert(reverseBits(43261596) === 964176192);
assert(reverseBits(4294967293) === 3221225471);
assert(reverseBits(0) === 0);
assert(reverseBits(4294967295) === 4294967295);
assert(reverseBits(1) === 2147483648);
console.log("all tests pass");
