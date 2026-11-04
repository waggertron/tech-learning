import random


class RandomizedSet:
    def __init__(self):
        self.items = []                         # L1
        self.positions = {}                     # L2

    def insert(self, val: int) -> bool:
        if val in self.positions:               # L3
            return False                        # L4
        self.positions[val] = len(self.items)    # L5
        self.items.append(val)                  # L6
        return True                             # L7

    def remove(self, val: int) -> bool:
        if val not in self.positions:           # L8
            return False                        # L9
        index = self.positions[val]             # L10
        last = self.items[-1]                   # L11
        self.items[index] = last                 # L12
        self.positions[last] = index             # L13
        self.items.pop()                        # L14
        del self.positions[val]                 # L15
        return True                             # L16

    def getRandom(self) -> int:
        return random.choice(self.items)        # L17


def check_invariant(values, expected):
    assert set(values.items) == expected
    assert len(values.items) == len(values.positions) == len(expected)
    assert values.positions == {
        value: index for index, value in enumerate(values.items)
    }


def run_checks():
    values = RandomizedSet()
    expected = set()
    for value in [10, 20, 30, 40]:
        assert values.insert(value)
        expected.add(value)
        check_invariant(values, expected)
    assert not values.insert(20)
    assert not values.remove(99)
    check_invariant(values, expected)
    assert values.remove(20)
    expected.remove(20)
    assert values.items == [10, 40, 30]
    check_invariant(values, expected)
    for value in [30, 10, 40]:
        assert values.remove(value)
        expected.remove(value)
        check_invariant(values, expected)
    assert not values.remove(40)
    assert values.insert(-7)
    assert values.getRandom() == -7
    assert values.remove(-7)
    assert values.insert(-7)

    # Exercise every valid index deterministically, without a flaky frequency test.
    from unittest.mock import patch
    assert values.insert(0)
    assert values.insert(2**31 - 1)
    with patch.object(random, "choice", side_effect=lambda sequence: sequence[0]) as pick:
        assert values.getRandom() == -7
        assert pick.call_args.args[0] is values.items
    for index, value in enumerate(values.items):
        with patch.object(random, "choice", side_effect=lambda sequence: sequence[index]):
            assert values.getRandom() == value

    # Compare a repeatable mixed operation sequence with Python's set semantics.
    rng = random.Random(380)
    values = RandomizedSet()
    expected = set()
    for _ in range(2000):
        value = rng.randrange(-20, 21)
        if rng.randrange(2):
            assert values.insert(value) == (value not in expected)
            expected.add(value)
        else:
            assert values.remove(value) == (value in expected)
            expected.discard(value)
        check_invariant(values, expected)
        if expected:
            assert values.getRandom() in expected
    print("Swap-and-pop checks passed, including 2,000 mixed operations.")


if __name__ == "__main__":
    run_checks()
