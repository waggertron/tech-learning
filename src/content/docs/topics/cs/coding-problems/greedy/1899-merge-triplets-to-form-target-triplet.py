def merge_triplets(triplets, target):
    pass  # TODO: implement

def _run_tests():
    assert merge_triplets([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]) == True
    assert merge_triplets([[1, 3, 4], [2, 5, 8]], [2, 5, 8]) == True
    assert merge_triplets([[3, 4, 5]], [2, 5, 8]) == False
    assert merge_triplets([[1, 1, 1]], [1, 1, 1]) == True
    assert merge_triplets([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1, 1, 1]) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    merge_triplets([[i % 5 + 1, i % 7 + 1, i % 3 + 1] for i in range(10000)], [5, 7, 3])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf merge_triplets(n=10000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
