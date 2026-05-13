function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numPairsDivisibleBy60(time: number[]): number {
    const remainders = new Array(60).fill(0);         // L1: O(1), at most 60 distinct remainders
    let result = 0;                                   // L2: O(1)
    for (const t of time) {                          // L3: loop, n iterations
        const complement = (60 - t % 60) % 60;      // L4: O(1) compute complement remainder
        result += remainders[complement];             // L5: O(1) lookup
        remainders[t % 60]++;                        // L6: O(1) record this song's remainder
    }
    return result;                                    // L7: O(1)
}

assert(numPairsDivisibleBy60([30,20,150,100,40]) === 3);
assert(numPairsDivisibleBy60([60,60,60]) === 3);
assert(numPairsDivisibleBy60([10,50,90,30]) === 2);
assert(numPairsDivisibleBy60([1]) === 0);
assert(numPairsDivisibleBy60([60]) === 0);
console.log("all tests pass");
