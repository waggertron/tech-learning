from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.data = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.data[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.data[key]
        lo, hi = 0, len(entries) - 1
        result = ""
        while lo <= hi:
            mid = (lo + hi) // 2
            if entries[mid][0] <= timestamp:
                result = entries[mid][1]
                lo = mid + 1
            else:
                hi = mid - 1
        return result

store = TimeMap()
store.set("foo", "bar", 1)
assert store.get("foo", 1) == "bar"
assert store.get("foo", 3) == "bar"
store.set("foo", "bar2", 4)
assert store.get("foo", 4) == "bar2"
assert store.get("foo", 5) == "bar2"
assert store.get("foo", 0) == ""
assert store.get("missing", 1) == ""
print("all tests pass")
