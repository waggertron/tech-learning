def find_critical_and_pseudo_critical_edges(n, edges):
    pass  # TODO: implement

def _run_tests():
    result = find_critical_and_pseudo_critical_edges(5, [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]])
    assert result == [[0,1],[2,3,4,5]]
    result2 = find_critical_and_pseudo_critical_edges(4, [[0,1,1],[1,2,1],[2,3,1],[0,3,1]])
    assert result2 == [[],[0,1,2,3]]
    # single edge connecting two nodes
    result3 = find_critical_and_pseudo_critical_edges(2, [[0,1,5]])
    assert result3 == [[0],[]]
    # --- large-input timing ---
    import time as _t
    import random as _r
    _r.seed(42)
    n = 20
    edges = [[i, j, _r.randint(1, 100)] for i in range(n) for j in range(i+1, n)][:50]
    _t0 = _t.perf_counter()
    find_critical_and_pseudo_critical_edges(n, edges)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find_critical_and_pseudo_critical_edges on 20 nodes, 50 edges: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
