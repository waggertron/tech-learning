def erase_overlap_intervals(intervals):
    pass  # TODO: implement

def _run_tests():
    assert erase_overlap_intervals([[1, 2], [2, 3], [3, 4], [1, 3]]) == 1
    assert erase_overlap_intervals([[1, 2], [1, 2], [1, 2]]) == 2
    assert erase_overlap_intervals([[1, 2], [2, 3]]) == 0
    assert erase_overlap_intervals([[1, 5]]) == 0
    assert erase_overlap_intervals([]) == 0
    assert erase_overlap_intervals([[1, 100], [2, 3], [4, 5], [6, 7]]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
