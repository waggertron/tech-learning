function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TimeMap {
    private timestamps: Map<string, number[]> = new Map();
    private values: Map<string, string[]> = new Map();

    set(key: string, value: string, timestamp: number): void {
        if (!this.timestamps.has(key)) {
            this.timestamps.set(key, []);
            this.values.set(key, []);
        }
        this.timestamps.get(key)!.push(timestamp);
        this.values.get(key)!.push(value);
    }

    get(key: string, timestamp: number): string {
        const ts = this.timestamps.get(key) ?? [];
        // bisect_right equivalent: find insertion point for timestamp
        let lo = 0, hi = ts.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (ts[mid] <= timestamp) lo = mid + 1;
            else hi = mid;
        }
        const i = lo - 1;
        if (i < 0) return '';
        return this.values.get(key)![i];
    }
}

const store = new TimeMap();
store.set("foo", "bar", 1);
assert(store.get("foo", 1) === "bar");
assert(store.get("foo", 3) === "bar");
store.set("foo", "bar2", 4);
assert(store.get("foo", 4) === "bar2");
assert(store.get("foo", 5) === "bar2");
assert(store.get("foo", 0) === "");
assert(store.get("missing", 1) === "");
console.log("all tests pass");
