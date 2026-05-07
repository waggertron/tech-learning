def letter_combinations(digits):
    pass  # TODO: implement

def _run_tests():
    assert sorted(letter_combinations('23')) == sorted(['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'])
    assert letter_combinations('') == []
    assert sorted(letter_combinations('2')) == ['a', 'b', 'c']
    assert sorted(letter_combinations('7')) == ['p', 'q', 'r', 's']
    assert len(letter_combinations('22')) == 9
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    letter_combinations('2345')
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf letter_combinations("2345") n=4 digits: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
