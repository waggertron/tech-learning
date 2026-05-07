class TrieNode:

    def __init__(self):
        self.children = {}
        self.word = None

def find_words(board, words):
    pass  # TODO: implement

def _run_tests():
    board1 = [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']]
    result1 = set(find_words(board1, ['oath', 'pea', 'eat', 'rain']))
    assert result1 == {'oath', 'eat'}
    assert find_words([['a']], ['a']) == ['a']
    assert find_words([['a']], ['b']) == []
    board2 = [['a', 'b'], ['c', 'd']]
    assert set(find_words(board2, ['ab', 'cd', 'abdc'])) == {'ab', 'cd', 'abdc'}
    # --- large-input timing ---
    import time as _t
    import string as _string
    _chars = _string.ascii_lowercase
    _board = [[_chars[(r * 5 + c) % 26] for c in range(10)] for r in range(10)]
    _words_perf = [
        ''.join(_chars[(i * 7 + j) % 26] for j in range(5 + (i % 6)))
        for i in range(1000)
    ]
    _t0 = _t.perf_counter()
    find_words(_board, _words_perf)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find_words(10x10 board, 1000 words): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
