def hamming_weight(n):
    pass  # TODO: implement

def _run_tests():
    assert hamming_weight(11) == 3
    assert hamming_weight(128) == 1
    assert hamming_weight(0) == 0
    assert hamming_weight(4294967295) == 32
    assert hamming_weight(1) == 1
    assert hamming_weight(183) == 6
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    for i in range(1000):
        hamming_weight(i * 1000003 & 0xFFFFFFFF)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf hamming_weight x1000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
