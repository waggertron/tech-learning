function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isHappy(n: number): boolean {
    function nextN(x: number): number {
        let total = 0;
        while (x) {                     // L1: O(log x) digit extraction
            total += (x % 10) ** 2;
            x = Math.floor(x / 10);
        }
        return total;
    }

    let slow = n, fast = n;
    while (true) {
        slow = nextN(slow);             // L2: one step
        fast = nextN(nextN(fast));      // L3: two steps
        if (fast === 1) return true;    // L4: happy
        if (slow === fast) return false; // L5: cycle detected
    }
}

assert(isHappy(19) === true);
assert(isHappy(2) === false);
assert(isHappy(1) === true);
assert(isHappy(7) === true);
assert(isHappy(4) === false);
assert(isHappy(100) === true);
console.log('all tests pass');
