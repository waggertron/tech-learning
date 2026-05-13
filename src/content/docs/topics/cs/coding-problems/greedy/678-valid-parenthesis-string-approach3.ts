function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function checkValidString(s: string): boolean {
    let lo = 0;
    let hi = 0;
    for (const ch of s) {
        if (ch === '(') {
            lo++;
            hi++;
        } else if (ch === ')') {
            lo--;
            hi--;
        } else {
            lo--;
            hi++;
        }
        if (hi < 0) return false;
        if (lo < 0) lo = 0;
    }
    return lo === 0;
}

assert(checkValidString('()') === true);
assert(checkValidString('(*)') === true);
assert(checkValidString('(*))') === true);
assert(checkValidString('((') === false);
assert(checkValidString('*') === true);
assert(checkValidString('(*') === true);
assert(checkValidString(')') === false);
console.log("all tests pass");
