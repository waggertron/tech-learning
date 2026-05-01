def three_sum(nums: list[int]) -> list[list[int]]:
    pass  # TODO: implement

def _run_tests():

    def normalize(result):
        return sorted((tuple(t) for t in result))
    assert normalize(three_sum([-1, 0, 1, 2, -1, -4])) == [(-1, -1, 2), (-1, 0, 1)]
    assert three_sum([0, 1, 1]) == []
    assert three_sum([0, 0, 0]) == [[0, 0, 0]]
    assert three_sum([]) == []
    assert three_sum([-2, 0, 0, 2, 2]) == [[-2, 0, 2]]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
