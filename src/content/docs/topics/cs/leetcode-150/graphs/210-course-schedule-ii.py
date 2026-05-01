def find_order(num_courses, prerequisites):
    pass  # TODO: implement

def _run_tests():
    assert find_order(2, [[1, 0]]) == [0, 1]
    result = find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])
    assert result.index(0) < result.index(1)
    assert result.index(0) < result.index(2)
    assert result.index(1) < result.index(3)
    assert result.index(2) < result.index(3)
    assert find_order(2, [[1, 0], [0, 1]]) == []
    assert find_order(1, []) == [0]
    result = find_order(3, [])
    assert set(result) == {0, 1, 2}
    assert find_order(3, [[0, 1], [1, 2], [2, 0]]) == []
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
