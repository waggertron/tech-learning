class RandomizedSet:
    def __init__(self):
        self.items = []
        self.positions = {}

    def insert(self, val: int) -> bool:
        raise NotImplementedError("Record the new index and append the value")

    def remove(self, val: int) -> bool:
        raise NotImplementedError("Replace the removed value with the last value")

    def getRandom(self) -> int:
        raise NotImplementedError("Choose directly from the stored list")


if __name__ == "__main__":
    values = RandomizedSet()
    print(values.insert(10))
    print(values.insert(20))
    print(values.remove(10))
    print(values.getRandom())  # Only 20 remains.
