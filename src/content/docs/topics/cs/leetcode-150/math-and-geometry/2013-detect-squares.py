from collections import defaultdict

class DetectSquares:

    def __init__(self):
        pass  # TODO: implement

    def add(self, point):
        pass  # TODO: implement

    def count(self, point):
        pass  # TODO: implement

def _run_tests():
    d = DetectSquares()
    d.add([3, 10])
    d.add([11, 2])
    d.add([3, 2])
    assert d.count([11, 10]) == 1
    assert d.count([14, 8]) == 0
    d.add([11, 2])
    assert d.count([11, 10]) == 2
    d2 = DetectSquares()
    assert d2.count([0, 0]) == 0
    d3 = DetectSquares()
    d3.add([0, 0])
    d3.add([2, 0])
    d3.add([0, 2])
    d3.add([2, 2])
    assert d3.count([0, 0]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
