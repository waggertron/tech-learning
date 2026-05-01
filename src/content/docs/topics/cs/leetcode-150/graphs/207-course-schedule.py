def can_finish(num_courses, prerequisites):
    pass  # TODO: implement

def _run_tests():
    assert can_finish(2, [[1, 0]]) == True
    assert can_finish(2, [[1, 0], [0, 1]]) == False
    assert can_finish(5, []) == True
    assert can_finish(1, []) == True
    assert can_finish(3, [[1, 0], [2, 1], [0, 2]]) == False
    assert can_finish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
