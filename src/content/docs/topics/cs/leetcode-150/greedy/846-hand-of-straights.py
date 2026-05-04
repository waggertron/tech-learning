def is_n_straight_hand(hand, group_size):
    pass  # TODO: implement

def _run_tests():
    assert is_n_straight_hand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3) == True
    assert is_n_straight_hand([1, 2, 3, 4, 5], 4) == False
    assert is_n_straight_hand([1], 1) == True
    assert is_n_straight_hand([1, 2, 3], 3) == True
    assert is_n_straight_hand([1, 2, 4], 3) == False
    assert is_n_straight_hand([1, 1, 2, 2, 3, 3], 3) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    is_n_straight_hand(list(range(10000)), 10)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is_n_straight_hand(n=10000, group_size=10): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
