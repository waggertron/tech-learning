def set_zeroes(matrix):
    pass  # TODO: implement

def _run_tests():
    m = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
    set_zeroes(m)
    assert m == [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
    m2 = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]
    set_zeroes(m2)
    assert m2 == [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
    m3 = [[1]]
    set_zeroes(m3)
    assert m3 == [[1]]
    m4 = [[0]]
    set_zeroes(m4)
    assert m4 == [[0]]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
