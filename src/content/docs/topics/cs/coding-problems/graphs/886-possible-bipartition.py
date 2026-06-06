from collections import defaultdict, deque

def possible_bipartition(n: int, dislikes: list[list[int]]) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert possible_bipartition(4, [[1,2],[1,3],[2,4]]) == True
    assert possible_bipartition(3, [[1,2],[1,3],[2,3]]) == False
    assert possible_bipartition(5, [[1,2],[2,3],[3,4],[4,5],[1,5]]) == False
    assert possible_bipartition(4, []) == True
    assert possible_bipartition(4, [[1,2],[3,4]]) == True
    assert possible_bipartition(1, []) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    # Even cycle of 200 people: bipartite
    n = 200
    big_dislikes = [[i, i % n + 1] for i in range(1, n + 1)]
    possible_bipartition(n, big_dislikes)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf possible-bipartition {n} people even cycle: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
