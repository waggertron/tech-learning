class MinStack:

    def __init__(self):
        pass  # TODO: implement

    def push(self, val: int) -> None:
        pass  # TODO: implement

    def pop(self) -> None:
        pass  # TODO: implement

    def top(self) -> int:
        pass  # TODO: implement

    def getMin(self) -> int:
        pass  # TODO: implement

def _run_tests():
    ms = MinStack()
    ms.push(-2)
    ms.push(0)
    ms.push(-3)
    assert ms.getMin() == -3
    ms.pop()
    assert ms.top() == 0
    assert ms.getMin() == -2
    ms2 = MinStack()
    ms2.push(1)
    ms2.push(2)
    ms2.push(3)
    assert ms2.getMin() == 1
    ms2.pop()
    assert ms2.getMin() == 1
    ms3 = MinStack()
    ms3.push(5)
    assert ms3.top() == 5
    assert ms3.getMin() == 5
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    _ms_stack = MinStack()
    for _i in range(5000):
        _ms_stack.push(_i)
    _ms_stack.getMin()
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 5000-element push + getMin: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
