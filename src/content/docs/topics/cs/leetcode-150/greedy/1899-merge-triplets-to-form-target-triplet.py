def merge_triplets(triplets, target):
    pass  # TODO: implement

def _run_tests():
    assert merge_triplets([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]) == True
    assert merge_triplets([[1, 3, 4], [2, 5, 8]], [2, 5, 8]) == True
    assert merge_triplets([[3, 4, 5]], [2, 5, 8]) == False
    assert merge_triplets([[1, 1, 1]], [1, 1, 1]) == True
    assert merge_triplets([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1, 1, 1]) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
