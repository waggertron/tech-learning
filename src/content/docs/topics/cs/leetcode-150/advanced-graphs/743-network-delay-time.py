import heapq

from collections import defaultdict

def network_delay_time(times, n, k):
    pass  # TODO: implement

def _run_tests():
    assert network_delay_time([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2) == 2
    assert network_delay_time([[1, 2, 1]], 2, 1) == 1
    assert network_delay_time([[1, 2, 1]], 2, 2) == -1
    assert network_delay_time([], 1, 1) == 0
    assert network_delay_time([[1, 2, 1], [1, 2, 5]], 2, 1) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
