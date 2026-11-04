import random


class RandomizedSet:
    def __init__(self):
        self.items = set()

    def insert(self, val: int) -> bool:
        if val in self.items:
            return False
        self.items.add(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.items:
            return False
        self.items.remove(val)
        return True

    def getRandom(self) -> int:
        return random.choice(tuple(self.items))


if __name__ == "__main__":
    values = RandomizedSet()
    assert values.insert(10)
    assert not values.insert(10)
    assert not values.remove(99)
    assert values.insert(20)
    assert values.getRandom() in {10, 20}
    assert values.remove(10)
    assert values.getRandom() == 20
    print("Set-based baseline checks passed; getRandom is O(n).")
