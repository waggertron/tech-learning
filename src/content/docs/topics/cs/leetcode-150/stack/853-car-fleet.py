def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert car_fleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) == 3
    assert car_fleet(10, [3], [3]) == 1
    assert car_fleet(100, [0, 2, 4], [4, 2, 1]) == 1
    assert car_fleet(10, [6, 8], [3, 2]) == 2
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
