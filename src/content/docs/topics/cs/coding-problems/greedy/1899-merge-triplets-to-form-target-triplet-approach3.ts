function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function mergeTripletsEarly(triplets: number[][], target: number[]): boolean {
    let hit = 0;
    for (const t of triplets) {
        if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
        for (let i = 0; i < 3; i++) {
            if (t[i] === target[i]) hit |= 1 << i;
        }
        if (hit === 0b111) return true;
    }
    return hit === 0b111;
}

assert(mergeTripletsEarly([[2,5,3],[1,8,4],[1,7,5]], [2,7,5]) === true);
assert(mergeTripletsEarly([[1,3,4],[2,5,8]], [2,5,8]) === true);
assert(mergeTripletsEarly([[3,4,5]], [2,5,8]) === false);
assert(mergeTripletsEarly([[1,1,1]], [1,1,1]) === true);
assert(mergeTripletsEarly([[1,0,0],[0,1,0],[0,0,1]], [1,1,1]) === true);
console.log("all tests pass");
