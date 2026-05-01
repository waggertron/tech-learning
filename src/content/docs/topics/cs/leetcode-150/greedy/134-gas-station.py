def can_complete_circuit(gas, cost):
    pass  # TODO: implement

def _run_tests():
    assert can_complete_circuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) == 3
    assert can_complete_circuit([2, 3, 4], [3, 4, 3]) == -1
    assert can_complete_circuit([1], [1]) == 0
    assert can_complete_circuit([5], [4]) == 0
    assert can_complete_circuit([2, 0, 1], [0, 1, 2]) == 0
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
