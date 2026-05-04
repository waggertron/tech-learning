def min_cost_climbing_stairs(cost):
    pass  # TODO: implement

def _run_tests():
    assert min_cost_climbing_stairs([10, 15, 20]) == 15
    assert min_cost_climbing_stairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) == 6
    assert min_cost_climbing_stairs([0, 0]) == 0
    assert min_cost_climbing_stairs([1, 2]) == 1
    assert min_cost_climbing_stairs([5, 3, 1, 2]) == 4
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    min_cost_climbing_stairs(list(range(500, 0, -1)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf min_cost_climbing_stairs(range 500 desc): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
