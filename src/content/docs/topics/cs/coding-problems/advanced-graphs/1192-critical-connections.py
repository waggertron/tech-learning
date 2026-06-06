from collections import defaultdict

def critical_connections(n: int, connections: list[list[int]]) -> list[list[int]]:
    pass  # TODO: implement

def _run_tests():
    assert critical_connections(4, [[0,1],[1,2],[2,0],[1,3]]) == [[1,3]]
    # single edge: always a bridge
    assert critical_connections(2, [[0,1]]) == [[0,1]]
    # triangle: no bridges
    assert critical_connections(3, [[0,1],[1,2],[0,2]]) == []
    # two triangles joined by one edge
    result = critical_connections(6, [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[1,3]])
    assert sorted(result) == [[1,3]]
    # --- large-input timing ---
    import time as _t
    n = 500
    edges = [[i, i+1] for i in range(n-1)]
    _t0 = _t.perf_counter()
    critical_connections(n, edges)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf critical_connections on chain of 500 nodes: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
