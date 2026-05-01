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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
