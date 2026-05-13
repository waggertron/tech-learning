from collections import defaultdict
from bisect import bisect_right

class TimeMap:
    def __init__(self):
        self.timestamps = defaultdict(list)
        self.values = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.timestamps[key].append(timestamp)
        self.values[key].append(value)

    def get(self, key: str, timestamp: int) -> str:
        ts = self.timestamps[key]
        i = bisect_right(ts, timestamp) - 1
        if i < 0:
            return ""
        return self.values[key][i]

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
