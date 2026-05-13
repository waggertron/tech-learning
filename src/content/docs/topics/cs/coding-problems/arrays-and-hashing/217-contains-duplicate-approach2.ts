function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function containsDuplicate(nums: number[]): boolean {
    const sorted = [...nums].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1]) return true;
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
