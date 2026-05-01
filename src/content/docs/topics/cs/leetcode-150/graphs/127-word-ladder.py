def ladder_length(beginWord, endWord, wordList):
    pass  # TODO: implement

def _run_tests():
    assert ladder_length('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']) == 5
    assert ladder_length('hit', 'cot', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']) == 0
    assert ladder_length('hot', 'dot', ['dot', 'lot']) == 2
    assert ladder_length('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']) == 0
    assert ladder_length('a', 'c', ['a', 'b', 'c']) == 2
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
