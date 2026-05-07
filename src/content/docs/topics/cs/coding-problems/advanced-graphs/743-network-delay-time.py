def network_delay_time(times, n, k):
    pass  # TODO: implement

def _run_tests():
    assert network_delay_time([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2) == 2
    assert network_delay_time([[1, 2, 1]], 2, 1) == 1
    assert network_delay_time([[1, 2, 1]], 2, 2) == -1
    assert network_delay_time([], 1, 1) == 0
    assert network_delay_time([[1, 2, 1], [1, 2, 5]], 2, 1) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_times = [[i, i + 1, 1] for i in range(1, 200)]
    network_delay_time(big_times, 200, 1)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf network-delay-time 200 nodes chain: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
