def min_cost_climbing_stairs(cost):
    pass  # TODO: implement

def _run_tests():
    assert min_cost_climbing_stairs([10, 15, 20]) == 15
    assert min_cost_climbing_stairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) == 6
    assert min_cost_climbing_stairs([0, 0]) == 0
    assert min_cost_climbing_stairs([1, 2]) == 1
    assert min_cost_climbing_stairs([5, 3, 1, 2]) == 4
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
