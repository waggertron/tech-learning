def encode(strs: list[str]) -> str:
    pass  # TODO: implement

def decode(s: str) -> list[str]:
    pass  # TODO: implement

def _run_tests():
    cases = [['hello', 'world', 'foo', 'bar'], [''], ['a'], [], ['hello#world', 'foo#bar'], ['5#abc', 'def']]
    for strs in cases:
        assert decode(encode(strs)) == strs, f'Failed on: {strs}'
    # --- large-input timing ---
    import time as _t
    _big = ['word' * 10] * 10000
    _t0 = _t.perf_counter()
    decode(encode(_big))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf encode+decode n=10000 strings: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
