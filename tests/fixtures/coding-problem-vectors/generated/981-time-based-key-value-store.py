class TimeMap:
    def __init__(self) -> None:
        self.values: dict[str, list[tuple[int, str]]] = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.values.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.values.get(key, [])
        left, right = 0, len(entries) - 1
        result = ""
        while left <= right:
            middle = left + (right - left) // 2
            if entries[middle][0] <= timestamp:
                result = entries[middle][1]
                left = middle + 1
            else:
                right = middle - 1
        return result


def run_tests() -> None:
    # TEST_VECTORS_BEGIN sha256:cf4d23abaa64548a94333272dc1be063e51de9f2106a9e536fc46e3860921b71
    subject1 = TimeMap()
    subject1.set("foo", "bar", 1)
    assert subject1.get("foo", 1) == "bar", "exact-and-prior-lookups[2]"
    assert subject1.get("foo", 3) == "bar", "exact-and-prior-lookups[3]"
    subject1.set("foo", "bar2", 4)
    assert subject1.get("foo", 4) == "bar2", "exact-and-prior-lookups[5]"
    assert subject1.get("foo", 5) == "bar2", "exact-and-prior-lookups[6]"
    subject2 = TimeMap()
    subject2.set("alpha", "one", 1)
    subject2.set("beta", "two", 2)
    assert subject2.get("alpha", 2) == "one", "keys-remain-independent[3]"
    assert subject2.get("beta", 2) == "two", "keys-remain-independent[4]"
    subject3 = TimeMap()
    assert subject3.get("missing", 1) == "", "missing-key[1]"
    subject4 = TimeMap()
    subject4.set("foo", "bar", 2)
    assert subject4.get("foo", 1) == "", "lookup-before-first-timestamp[2]"
    # EXCLUDED_VECTOR nonincreasing-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",2]},{"operation":"set","arguments":["foo","older",1]}]] | Set timestamps must increase for each key.
    # EXCLUDED_VECTOR empty-key: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["","bar",1]}]] | Keys must contain at least one lowercase letter.
    # EXCLUDED_VECTOR zero-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",0]}]] | Timestamps start at one in the problem contract.
    # TEST_VECTORS_END
    print("All shared test vectors passed")


if __name__ == "__main__":
    run_tests()
