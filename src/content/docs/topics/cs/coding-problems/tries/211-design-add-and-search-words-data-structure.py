class TrieNode:

    def __init__(self):
        self.children = {}
        self.is_end = False

class WordDictionary:

    def __init__(self):
        pass  # TODO: implement

    def addWord(self, word):
        pass  # TODO: implement

    def search(self, word):
        pass  # TODO: implement

def _run_tests():
    wd = WordDictionary()
    wd.addWord('bad')
    wd.addWord('dad')
    wd.addWord('mad')
    assert wd.search('pad') == False
    assert wd.search('bad') == True
    assert wd.search('.ad') == True
    assert wd.search('b..') == True
    assert wd.search('...') == True
    assert wd.search('....') == False
    # --- large-input timing ---
    import time as _t
    import string as _string
    _chars = _string.ascii_lowercase
    _words = [
        ''.join(_chars[(i * 7 + j) % 26] for j in range(5 + (i % 6)))
        for i in range(1000)
    ]
    _big_wd = WordDictionary()
    _t0 = _t.perf_counter()
    for _w in _words:
        _big_wd.addWord(_w)
    for _w in _words:
        _big_wd.search(_w)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf WordDictionary addWord+search 1000 words (len 5-10): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
