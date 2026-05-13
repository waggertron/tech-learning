function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function containsDuplicate(nums: number[]): boolean {
    const seen = new Set<number>();
    for (const x of nums) {
        if (seen.has(x)) return true;
        seen.add(x);
    }
    return false;
}

assert(containsDuplicate([1, 2, 3, 1]) === true);
assert(containsDuplicate([1, 2, 3, 4]) === false);
assert(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) === true);
assert(containsDuplicate([]) === false);
assert(containsDuplicate([5]) === false);
assert(containsDuplicate([5, 5]) === true);
console.log("all tests pass");
