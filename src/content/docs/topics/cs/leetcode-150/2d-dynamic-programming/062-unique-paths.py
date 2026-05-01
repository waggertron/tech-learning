def unique_paths(m, n):
    pass  # TODO: implement

def _run_tests():
    assert unique_paths(3, 7) == 28
    assert unique_paths(3, 2) == 3
    assert unique_paths(1, 1) == 1
    assert unique_paths(1, 5) == 1
    assert unique_paths(5, 1) == 1
    assert unique_paths(3, 3) == 6
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
