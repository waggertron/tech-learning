def min_meeting_rooms(intervals):
    pass  # TODO: implement

def _run_tests():
    assert min_meeting_rooms([[0, 30], [5, 10], [15, 20]]) == 2
    assert min_meeting_rooms([[7, 10], [2, 4]]) == 1
    assert min_meeting_rooms([[1, 5]]) == 1
    assert min_meeting_rooms([]) == 0
    assert min_meeting_rooms([[1, 4], [2, 5], [3, 6]]) == 3
    assert min_meeting_rooms([[0, 5], [5, 10], [10, 15]]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
