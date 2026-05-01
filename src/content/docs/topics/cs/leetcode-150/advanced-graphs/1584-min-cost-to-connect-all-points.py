def min_cost_connect_points(points):
    pass  # TODO: implement

def _run_tests():
    assert min_cost_connect_points([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]) == 20
    assert min_cost_connect_points([[3, 12], [-2, 5], [-4, 1]]) == 18
    assert min_cost_connect_points([[0, 0]]) == 0
    assert min_cost_connect_points([[0, 0], [1, 1]]) == 2
    assert min_cost_connect_points([[0, 0], [1, 0], [2, 0], [3, 0]]) == 3
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
