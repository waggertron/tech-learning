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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
