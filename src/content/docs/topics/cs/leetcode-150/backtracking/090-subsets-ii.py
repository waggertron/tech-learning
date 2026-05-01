def subsets_with_dup(nums):
    pass  # TODO: implement

def _run_tests():
    r = subsets_with_dup([1, 2, 2])
    assert sorted(map(tuple, r)) == sorted([(), (1,), (2,), (1, 2), (2, 2), (1, 2, 2)])
    r2 = subsets_with_dup([0])
    assert sorted(map(tuple, r2)) == [(), (0,)]
    r3 = subsets_with_dup([2, 2, 2])
    assert sorted(map(tuple, r3)) == sorted([(), (2,), (2, 2), (2, 2, 2)])
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
