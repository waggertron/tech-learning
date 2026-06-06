from collections import deque

def is_bipartite(graph: list[list[int]]) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert is_bipartite([[1,2,3],[0,2],[0,1,3],[0,2]]) == False
    assert is_bipartite([[1,3],[0,2],[1,3],[0,2]]) == True
    assert is_bipartite([[]]) == True
    assert is_bipartite([[1],[0]]) == True
    assert is_bipartite([[1,2],[0,2],[0,1]]) == False
    assert is_bipartite([[1],[0],[3],[2]]) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    # Even cycle of 200 nodes: bipartite
    n = 200
    graph = [[(i - 1) % n, (i + 1) % n] for i in range(n)]
    is_bipartite(graph)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is-graph-bipartite {n}-node even cycle: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
