export {};

function assert(condition: boolean, message: string): void {
    if (!condition) throw new Error(message);
}

function countBits(n: number): number[] {
    const counts = new Array(n + 1).fill(0);
    for (let value = 1; value <= n; value += 1) {
        counts[value] = counts[value >> 1] + (value & 1);
    }
    return counts;
}

function runTests(): void {
    // TEST_VECTORS_BEGIN sha256:c6ee896d6c38441fea68d4a24bb494a2ee8d855229cff1259c3e14c3c9159da0
    assert(JSON.stringify(countBits(2)) === JSON.stringify([0, 1, 1]), "through-two");
    assert(JSON.stringify(countBits(5)) === JSON.stringify([0, 1, 1, 2, 1, 2]), "through-five");
    assert(JSON.stringify(countBits(8)) === JSON.stringify([0, 1, 1, 2, 1, 2, 2, 3, 1]), "through-eight");
    assert(JSON.stringify(countBits(0)) === JSON.stringify([0]), "zero");
    assert(JSON.stringify(countBits(1)) === JSON.stringify([0, 1]), "one");
    // EXCLUDED_VECTOR negative-input: [-1] | The input contract requires n to be nonnegative.
    // EXCLUDED_VECTOR above-constraint: [100001] | The published problem constraint limits n to 100000.
    // TEST_VECTORS_END
    console.log("All shared test vectors passed");
}

runTests();
