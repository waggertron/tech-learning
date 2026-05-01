def letter_combinations(digits):
    pass  # TODO: implement

def _run_tests():
    assert sorted(letter_combinations('23')) == sorted(['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'])
    assert letter_combinations('') == []
    assert sorted(letter_combinations('2')) == ['a', 'b', 'c']
    assert sorted(letter_combinations('7')) == ['p', 'q', 'r', 's']
    assert len(letter_combinations('22')) == 9
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
