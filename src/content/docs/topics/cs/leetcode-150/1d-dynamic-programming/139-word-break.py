def word_break(s, word_dict):
    pass  # TODO: implement

def _run_tests():
    assert word_break('leetcode', ['leet', 'code']) == True
    assert word_break('applepenapple', ['apple', 'pen']) == True
    assert word_break('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']) == False
    assert word_break('a', ['a']) == True
    assert word_break('a', ['b']) == False
    assert word_break('aaaa', ['a', 'aa']) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
