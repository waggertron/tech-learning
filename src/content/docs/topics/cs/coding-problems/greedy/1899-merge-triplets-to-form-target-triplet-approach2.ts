function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function mergeTriplets(triplets: number[][], target: number[]): boolean {
    const hit = [false, false, false];
    for (const t of triplets) {
        if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
        for (let i = 0; i < 3; i++) {
            if (t[i] === target[i]) hit[i] = true;
        }
    }
    return hit[0] && hit[1] && hit[2];
}

assert(mergeTriplets([[2,5,3],[1,8,4],[1,7,5]], [2,7,5]) === true);
assert(mergeTriplets([[1,3,4],[2,5,8]], [2,5,8]) === true);
assert(mergeTriplets([[3,4,5]], [2,5,8]) === false);
assert(mergeTriplets([[1,1,1]], [1,1,1]) === true);
assert(mergeTriplets([[1,0,0],[0,1,0],[0,0,1]], [1,1,1]) === true);
console.log("all tests pass");
