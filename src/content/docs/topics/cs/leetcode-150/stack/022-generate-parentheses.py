def generate_parenthesis(n: int) -> list[str]:
    pass  # TODO: implement

def _run_tests():
    assert sorted(generate_parenthesis(1)) == ['()']
    assert sorted(generate_parenthesis(2)) == sorted(['(())', '()()'])
    assert sorted(generate_parenthesis(3)) == sorted(['((()))', '(()())', '(())()', '()(())', '()()()'])
    assert len(generate_parenthesis(4)) == 14
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    generate_parenthesis(8)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf n=8 generate parentheses: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
