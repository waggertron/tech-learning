def num_islands(grid):
    pass  # TODO: implement

def _run_tests():
    g1 = [['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]
    assert num_islands(g1) == 1
    g2 = [['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]
    assert num_islands(g2) == 3
    assert num_islands([]) == 0
    assert num_islands([['1']]) == 1
    assert num_islands([['0']]) == 0
    g3 = [['1', '1'], ['1', '1']]
    assert num_islands(g3) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big = [['1'] * 50 for _ in range(50)]
    num_islands(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf num-islands 50x50 all-land grid: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
