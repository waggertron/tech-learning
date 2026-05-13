function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class MinStack {
    private stack: [number, number][] = [];  // [value, running_min]

    push(val: number): void {
        const curMin = this.stack.length === 0 ? val : Math.min(val, this.stack[this.stack.length - 1][1]);
        this.stack.push([val, curMin]);
    }

    pop(): void {
        this.stack.pop();
    }

    top(): number {
        return this.stack[this.stack.length - 1][0];
    }

    getMin(): number {
        return this.stack[this.stack.length - 1][1];
    }
}

const ms = new MinStack();
ms.push(-2);
ms.push(0);
ms.push(-3);
assert(ms.getMin() === -3);
ms.pop();
assert(ms.top() === 0);
assert(ms.getMin() === -2);

const ms2 = new MinStack();
ms2.push(1);
ms2.push(2);
ms2.push(3);
assert(ms2.getMin() === 1);
ms2.pop();
assert(ms2.getMin() === 1);

const ms3 = new MinStack();
ms3.push(5);
assert(ms3.top() === 5);
assert(ms3.getMin() === 5);
console.log('all tests pass');
