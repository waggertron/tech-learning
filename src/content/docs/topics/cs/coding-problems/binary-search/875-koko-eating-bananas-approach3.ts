function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minEatingSpeed(piles: number[], h: number): number {
    function hours(k: number): number {
        return piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);
    }

    let lo = 1, hi = Math.max(...piles);
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (hours(mid) <= h) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

assert(minEatingSpeed([3, 6, 7, 11], 8) === 4);
assert(minEatingSpeed([30, 11, 23, 4, 20], 5) === 30);
assert(minEatingSpeed([30, 11, 23, 4, 20], 6) === 23);
assert(minEatingSpeed([1], 1) === 1);
assert(minEatingSpeed([1000000000], 2) === 500000000);
console.log("all tests pass");
