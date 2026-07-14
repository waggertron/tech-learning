def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    pass  # TODO: implement

def _run_tests() -> None:
    assert can_complete_circuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) == 3
    assert can_complete_circuit([2, 3, 4], [3, 4, 3]) == -1
    assert can_complete_circuit([1], [1]) == 0
    assert can_complete_circuit([5], [4]) == 0
    assert can_complete_circuit([0], [0]) == 0
    assert can_complete_circuit([10_000], [10_000]) == 0
    assert can_complete_circuit([2, 0, 1], [0, 1, 2]) == 0

    n = 100_000
    large_gas = [0] * n
    large_cost = [0] * n
    for i in range(10_000):
        large_cost[i] = 1
    large_gas[10_000] = 10_000

    import time as _t
    _t0 = _t.perf_counter()
    assert can_complete_circuit(large_gas, large_cost) == 10_000
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf can_complete_circuit(n=100000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
