def find_cheapest_price(n, flights, src, dst, k):
    pass  # TODO: implement

def _run_tests():
    flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]]
    assert find_cheapest_price(4, flights, 0, 3, 1) == 700
    assert find_cheapest_price(4, flights, 0, 3, 0) == -1
    assert find_cheapest_price(4, flights, 0, 3, 2) == 400
    assert find_cheapest_price(2, [[0, 1, 500]], 0, 1, 0) == 500
    assert find_cheapest_price(3, [[0, 1, 100], [1, 2, 50]], 1, 1, 1) == 0
    assert find_cheapest_price(3, [[0, 1, 100]], 0, 2, 5) == -1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_flights = [[i, i + 1, i + 1] for i in range(199)]
    find_cheapest_price(200, big_flights, 0, 199, 200)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf cheapest-flights 200 nodes chain k=200: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
