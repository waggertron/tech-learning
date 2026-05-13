function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canCompleteCircuit(gas: number[], cost: number[]): number {
    const totalGas = gas.reduce((a, b) => a + b, 0);
    const totalCost = cost.reduce((a, b) => a + b, 0);
    if (totalGas < totalCost) return -1;
    let tank = 0;
    let start = 0;
    for (let i = 0; i < gas.length; i++) {
        tank += gas[i] - cost[i];
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return start;
}

assert(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) === 3);
assert(canCompleteCircuit([2, 3, 4], [3, 4, 3]) === -1);
assert(canCompleteCircuit([1], [1]) === 0);
assert(canCompleteCircuit([5], [4]) === 0);
assert(canCompleteCircuit([2, 0, 1], [0, 1, 2]) === 0);
console.log("all tests pass");
