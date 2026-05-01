from collections import Counter

def is_n_straight_hand(hand, group_size):
    pass  # TODO: implement

def _run_tests():
    assert is_n_straight_hand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3) == True
    assert is_n_straight_hand([1, 2, 3, 4, 5], 4) == False
    assert is_n_straight_hand([1], 1) == True
    assert is_n_straight_hand([1, 2, 3], 3) == True
    assert is_n_straight_hand([1, 2, 4], 3) == False
    assert is_n_straight_hand([1, 1, 2, 2, 3, 3], 3) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
