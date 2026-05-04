def num_decodings(s):
    pass  # TODO: implement

def _run_tests():
    assert num_decodings('12') == 2
    assert num_decodings('226') == 3
    assert num_decodings('06') == 0
    assert num_decodings('0') == 0
    assert num_decodings('1') == 1
    assert num_decodings('11106') == 2
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    num_decodings('1' * 500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf num_decodings("1"*500): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
