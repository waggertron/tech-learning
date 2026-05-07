def num_pairs_divisible_by60(time: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert num_pairs_divisible_by60([30,20,150,100,40]) == 3
    assert num_pairs_divisible_by60([60,60,60]) == 3
    assert num_pairs_divisible_by60([10,50,90,30]) == 2
    assert num_pairs_divisible_by60([1]) == 0
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    num_pairs_divisible_by60([30] * 10000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf num_pairs_divisible_by60 n=10000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
