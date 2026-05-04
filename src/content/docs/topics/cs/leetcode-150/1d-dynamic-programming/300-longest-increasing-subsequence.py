def length_of_lis(nums):
    pass  # TODO: implement

def _run_tests():
    assert length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]) == 4
    assert length_of_lis([0, 1, 0, 3, 2, 3]) == 4
    assert length_of_lis([7, 7, 7, 7]) == 1
    assert length_of_lis([1]) == 1
    assert length_of_lis([1, 2, 3, 4, 5]) == 5
    assert length_of_lis([5, 4, 3, 2, 1]) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    length_of_lis(list(range(500, 0, -1)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf length_of_lis(range 500 desc): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
