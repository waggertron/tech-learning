function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isNStraightHand(hand: number[], groupSize: number): boolean {
    if (hand.length % groupSize !== 0) return false;
    const counts = new Map<number, number>();
    for (const v of hand) counts.set(v, (counts.get(v) ?? 0) + 1);
    const keys = Array.from(counts.keys()).sort((a, b) => a - b);
    for (const x of keys) {
        const c = counts.get(x)!;
        if (c === 0) continue;
        for (let k = 0; k < groupSize; k++) {
            const cur = counts.get(x + k) ?? 0;
            if (cur < c) return false;
            counts.set(x + k, cur - c);
        }
    }
    return true;
}

assert(isNStraightHand([1,2,3,6,2,3,4,7,8], 3) === true);
assert(isNStraightHand([1,2,3,4,5], 4) === false);
assert(isNStraightHand([1], 1) === true);
assert(isNStraightHand([1,2,3], 3) === true);
assert(isNStraightHand([1,2,4], 3) === false);
assert(isNStraightHand([1,1,2,2,3,3], 3) === true);
console.log("all tests pass");
