def reverse_bits(n):
    pass  # TODO: implement

def _run_tests():
    assert reverse_bits(43261596) == 964176192
    assert reverse_bits(4294967293) == 3221225471
    assert reverse_bits(0) == 0
    assert reverse_bits(4294967295) == 4294967295
    assert reverse_bits(1) == 2147483648
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    for i in range(1000):
        reverse_bits(i * 1000003)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf reverse_bits x1000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
