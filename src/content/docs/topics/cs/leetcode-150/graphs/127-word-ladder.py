def ladder_length(beginWord, endWord, wordList):
    pass  # TODO: implement

def _run_tests():
    assert ladder_length('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']) == 5
    assert ladder_length('hit', 'cot', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']) == 0
    assert ladder_length('hot', 'dot', ['dot', 'lot']) == 2
    assert ladder_length('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']) == 0
    assert ladder_length('a', 'c', ['a', 'b', 'c']) == 2
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    ladder_length('aaaa', 'zzzz', [chr(65 + i % 26) * 4 for i in range(200)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf word-ladder 200-word list: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
