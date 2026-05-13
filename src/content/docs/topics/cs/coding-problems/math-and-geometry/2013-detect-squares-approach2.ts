function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class DetectSquares {
    private counts: Map<string, number> = new Map();   // L1: O(1)
    private points: Set<string> = new Set();            // L2: O(1), distinct points for iteration

    private key(x: number, y: number): string {
        return `${x},${y}`;
    }

    add(point: number[]): void {
        const k = this.key(point[0], point[1]);
        this.counts.set(k, (this.counts.get(k) ?? 0) + 1);  // L3: O(1) amortized
        this.points.add(k);                                   // L4: O(1) amortized
    }

    count(point: number[]): number {
        const [qx, qy] = point;
        let total = 0;
        for (const pk of this.points) {                       // L5: iterate all distinct points, O(n)
            const [x, y] = pk.split(',').map(Number);
            if (Math.abs(x - qx) === Math.abs(y - qy) && x !== qx && y !== qy) {  // L6: O(1)
                total += (this.counts.get(pk) ?? 0)
                       * (this.counts.get(this.key(x, qy)) ?? 0)
                       * (this.counts.get(this.key(qx, y)) ?? 0);  // L7: O(1)
            }
        }
        return total;
    }
}

const d = new DetectSquares();
d.add([3, 10]); d.add([11, 2]); d.add([3, 2]);
assert(d.count([11, 10]) === 1);
assert(d.count([14, 8]) === 0);
d.add([11, 2]);
assert(d.count([11, 10]) === 2);
const d2 = new DetectSquares();
assert(d2.count([0, 0]) === 0);
const d3 = new DetectSquares();
d3.add([0, 0]); d3.add([2, 0]); d3.add([0, 2]); d3.add([2, 2]);
assert(d3.count([0, 0]) === 1);
console.log('all tests pass');
