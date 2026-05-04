class DetectSquares:

    def __init__(self):
        pass  # TODO: implement

    def add(self, point):
        pass  # TODO: implement

    def count(self, point):
        pass  # TODO: implement

def _run_tests():
    d = DetectSquares()
    d.add([3, 10])
    d.add([11, 2])
    d.add([3, 2])
    assert d.count([11, 10]) == 1
    assert d.count([14, 8]) == 0
    d.add([11, 2])
    assert d.count([11, 10]) == 2
    d2 = DetectSquares()
    assert d2.count([0, 0]) == 0
    d3 = DetectSquares()
    d3.add([0, 0])
    d3.add([2, 0])
    d3.add([0, 2])
    d3.add([2, 2])
    assert d3.count([0, 0]) == 1

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    d_big = DetectSquares()
    for i in range(1000):
        d_big.add([i % 32, i % 32])
        d_big.count([i % 32, (i + 1) % 32])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf DetectSquares 1000 add+count ops: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
