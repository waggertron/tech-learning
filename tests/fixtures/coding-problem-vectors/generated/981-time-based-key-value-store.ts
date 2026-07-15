export {};

function assert(condition: boolean, message: string): void {
    if (!condition) throw new Error(message);
}

type Entry = { timestamp: number; value: string };

class TimeMap {
    private readonly values = new Map<string, Entry[]>();

    set(key: string, value: string, timestamp: number): void {
        const entries = this.values.get(key) ?? [];
        entries.push({ timestamp, value });
        this.values.set(key, entries);
    }

    get(key: string, timestamp: number): string {
        const entries = this.values.get(key) ?? [];
        let left = 0;
        let right = entries.length - 1;
        let result = "";
        while (left <= right) {
            const middle = left + Math.floor((right - left) / 2);
            if (entries[middle].timestamp <= timestamp) {
                result = entries[middle].value;
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }
        return result;
    }
}

function runTests(): void {
    // TEST_VECTORS_BEGIN sha256:cf4d23abaa64548a94333272dc1be063e51de9f2106a9e536fc46e3860921b71
    const subject1 = new TimeMap();
    subject1.set("foo", "bar", 1);
    assert(subject1.get("foo", 1) === "bar", "exact-and-prior-lookups[2]");
    assert(subject1.get("foo", 3) === "bar", "exact-and-prior-lookups[3]");
    subject1.set("foo", "bar2", 4);
    assert(subject1.get("foo", 4) === "bar2", "exact-and-prior-lookups[5]");
    assert(subject1.get("foo", 5) === "bar2", "exact-and-prior-lookups[6]");
    const subject2 = new TimeMap();
    subject2.set("alpha", "one", 1);
    subject2.set("beta", "two", 2);
    assert(subject2.get("alpha", 2) === "one", "keys-remain-independent[3]");
    assert(subject2.get("beta", 2) === "two", "keys-remain-independent[4]");
    const subject3 = new TimeMap();
    assert(subject3.get("missing", 1) === "", "missing-key[1]");
    const subject4 = new TimeMap();
    subject4.set("foo", "bar", 2);
    assert(subject4.get("foo", 1) === "", "lookup-before-first-timestamp[2]");
    // EXCLUDED_VECTOR nonincreasing-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",2]},{"operation":"set","arguments":["foo","older",1]}]] | Set timestamps must increase for each key.
    // EXCLUDED_VECTOR empty-key: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["","bar",1]}]] | Keys must contain at least one lowercase letter.
    // EXCLUDED_VECTOR zero-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",0]}]] | Timestamps start at one in the problem contract.
    // TEST_VECTORS_END
    console.log("All shared test vectors passed");
}

runTests();
