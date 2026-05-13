function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TimeMap {
    private data: Map<string, [number, string][]> = new Map();

    set(key: string, value: string, timestamp: number): void {
        if (!this.data.has(key)) this.data.set(key, []);
        this.data.get(key)!.push([timestamp, value]);
    }

    get(key: string, timestamp: number): string {
        const entries = this.data.get(key) ?? [];
        let lo = 0, hi = entries.length - 1;
        let result = '';
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (entries[mid][0] <= timestamp) {
                result = entries[mid][1];
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return result;
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
