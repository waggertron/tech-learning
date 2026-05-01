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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
