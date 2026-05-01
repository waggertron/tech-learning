def daily_temperatures(temperatures: list[int]) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]
    assert daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]
    assert daily_temperatures([30, 60, 90]) == [1, 1, 0]
    assert daily_temperatures([90, 60, 30]) == [0, 0, 0]
    assert daily_temperatures([70]) == [0]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
