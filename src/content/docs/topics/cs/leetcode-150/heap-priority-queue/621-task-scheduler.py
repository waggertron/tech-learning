from collections import Counter

def least_interval(tasks, n):
    pass  # TODO: implement

def _run_tests():
    assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 2) == 8
    assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 0) == 6
    assert least_interval(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2) == 16
    assert least_interval(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'], 2) == 8
    assert least_interval(['A', 'A', 'A'], 3) == 9
    assert least_interval(['A', 'A', 'A'], 0) == 3
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
