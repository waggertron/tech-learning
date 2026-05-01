def partition_labels(s):
    pass  # TODO: implement

def _run_tests():
    assert partition_labels('ababcbacadefegdehijhklij') == [9, 7, 8]
    assert partition_labels('eccbbbbdec') == [10]
    assert partition_labels('a') == [1]
    assert partition_labels('abcd') == [1, 1, 1, 1]
    assert partition_labels('aabb') == [2, 2]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
