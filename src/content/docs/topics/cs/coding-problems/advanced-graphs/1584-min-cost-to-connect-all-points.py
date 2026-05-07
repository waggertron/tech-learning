def min_cost_connect_points(points):
    pass  # TODO: implement

def _run_tests():
    assert min_cost_connect_points([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]) == 20
    assert min_cost_connect_points([[3, 12], [-2, 5], [-4, 1]]) == 18
    assert min_cost_connect_points([[0, 0]]) == 0
    assert min_cost_connect_points([[0, 0], [1, 1]]) == 2
    assert min_cost_connect_points([[0, 0], [1, 0], [2, 0], [3, 0]]) == 3
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_points = [[i, i * 2] for i in range(200)]
    min_cost_connect_points(big_points)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf min-cost-connect 200 points: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
