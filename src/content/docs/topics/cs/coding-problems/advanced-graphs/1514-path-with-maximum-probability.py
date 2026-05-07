import heapq
from collections import defaultdict

def max_probability(n, edges, succ_prob, start, end):
    pass  # TODO: implement

def _run_tests():
    assert abs(max_probability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.2], 0, 2) - 0.25) < 1e-5
    assert abs(max_probability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.3], 0, 2) - 0.3) < 1e-5
    # no path exists
    assert max_probability(3, [[0,1]], [0.5], 0, 2) == 0.0
    # direct single edge
    assert abs(max_probability(2, [[0,1]], [0.9], 0, 1) - 0.9) < 1e-5
    # start equals end
    assert abs(max_probability(3, [[0,1],[1,2]], [0.5,0.5], 1, 1) - 1.0) < 1e-5
    # --- large-input timing ---
    import time as _t
    import random as _r
    _r.seed(42)
    n = 500
    edges = [[i, (i+1) % n] for i in range(n)]
    probs = [_r.random() for _ in edges]
    _t0 = _t.perf_counter()
    max_probability(n, edges, probs, 0, n // 2)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf max_probability on 500 nodes ring: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
