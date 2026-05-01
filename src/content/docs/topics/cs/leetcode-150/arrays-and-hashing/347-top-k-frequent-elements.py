from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert sorted(top_k_frequent([1, 1, 1, 2, 2, 3], 2)) == [1, 2]
    assert top_k_frequent([1], 1) == [1]
    assert sorted(top_k_frequent([1, 2], 2)) == [1, 2]
    r = top_k_frequent([1, 2, 3], 1)
    assert len(r) == 1 and r[0] in [1, 2, 3]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
