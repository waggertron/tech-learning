def subsets(nums):
    pass  # TODO: implement

def _run_tests():
    r = subsets([1, 2, 3])
    assert len(r) == 8
    assert sorted(map(tuple, r)) == sorted([(), (1,), (2,), (3,), (1, 2), (1, 3), (2, 3), (1, 2, 3)])
    r2 = subsets([0])
    assert sorted(map(tuple, r2)) == [(), (0,)]
    assert subsets([]) == [[]]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
