def eval_rpn(tokens: list[str]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert eval_rpn(['2', '1', '+', '3', '*']) == 9
    assert eval_rpn(['4', '13', '5', '/', '+']) == 6
    assert eval_rpn(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']) == 22
    assert eval_rpn(['3']) == 3
    assert eval_rpn(['6', '2', '/']) == 3
    assert eval_rpn(['7', '2', '/']) == 3
    assert eval_rpn(['-7', '2', '/']) == -3
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    _tokens = ['1'] * 2500 + ['+'] * 2499
    eval_rpn(_tokens)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 4999-token RPN expression: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
