def can_attend_meetings(intervals):
    pass  # TODO: implement

def _run_tests():
    assert can_attend_meetings([[0, 30], [5, 10], [15, 20]]) == False
    assert can_attend_meetings([[7, 10], [2, 4]]) == True
    assert can_attend_meetings([]) == True
    assert can_attend_meetings([[1, 5]]) == True
    assert can_attend_meetings([[1, 5], [5, 10]]) == True
    assert can_attend_meetings([[1, 6], [5, 10]]) == False
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
