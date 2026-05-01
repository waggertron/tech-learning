def count_components(n, edges):
    pass  # TODO: implement

def _run_tests():
    assert count_components(5, [[0, 1], [1, 2], [3, 4]]) == 2
    assert count_components(5, [[0, 1], [1, 2], [2, 3], [3, 4]]) == 1
    assert count_components(4, []) == 4
    assert count_components(1, []) == 1
    assert count_components(3, [[0, 1], [1, 2], [0, 2]]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
