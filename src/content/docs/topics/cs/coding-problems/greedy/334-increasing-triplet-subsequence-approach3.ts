function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function increasingTriplet(nums: number[]): boolean {
    let first = Infinity, second = Infinity;
    for (const n of nums) {
        if (n <= first) first = n;
        else if (n <= second) second = n;
        else return true;
    }
    return false;
}

assert(increasingTriplet([1, 2, 3, 4, 5]) === true);
assert(increasingTriplet([5, 4, 3, 2, 1]) === false);
assert(increasingTriplet([2, 1, 5, 0, 4, 6]) === true);
assert(increasingTriplet([1, 2]) === false);
assert(increasingTriplet([1, 1, 1, 1, 1]) === false);
assert(increasingTriplet([20, 100, 10, 12, 5, 13]) === true);
console.log('all tests pass');
