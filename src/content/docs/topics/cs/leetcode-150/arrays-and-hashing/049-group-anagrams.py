def group_anagrams(strs: list[str]) -> list[list[str]]:
    pass  # TODO: implement

def _run_tests():

    def normalize(result):
        return sorted((sorted(g) for g in result))
    r1 = group_anagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
    assert normalize(r1) == [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]
    r2 = group_anagrams([''])
    assert normalize(r2) == [['']]
    r3 = group_anagrams(['a'])
    assert normalize(r3) == [['a']]
    r4 = group_anagrams(['abc', 'bca', 'cab'])
    assert normalize(r4) == [['abc', 'bca', 'cab']]
    r5 = group_anagrams(['a', 'b', 'c'])
    assert normalize(r5) == [['a'], ['b'], ['c']]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
