class TrieNode:

    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:

    def __init__(self):
        pass  # TODO: implement

    def insert(self, word):
        pass  # TODO: implement

    def search(self, word):
        pass  # TODO: implement

    def startsWith(self, prefix):
        pass  # TODO: implement

    def _walk(self, s):
        pass  # TODO: implement

def _run_tests():
    trie = Trie()
    trie.insert('apple')
    assert trie.search('apple') == True
    assert trie.search('app') == False
    assert trie.startsWith('app') == True
    trie.insert('app')
    assert trie.search('app') == True
    assert trie.search('ap') == False
    assert trie.startsWith('b') == False
    # --- large-input timing ---
    import time as _t
    import string as _string
    _chars = _string.ascii_lowercase
    _words = [
        ''.join(_chars[(i * 7 + j) % 26] for j in range(5 + (i % 6)))
        for i in range(1000)
    ]
    _big_trie = Trie()
    _t0 = _t.perf_counter()
    for _w in _words:
        _big_trie.insert(_w)
    for _w in _words:
        _big_trie.search(_w)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf Trie insert+search 1000 words (len 5-10): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
