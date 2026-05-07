def find_itinerary(tickets):
    pass  # TODO: implement

def _run_tests():
    assert find_itinerary([['MUC', 'LHR'], ['JFK', 'MUC'], ['SFO', 'SJC'], ['LHR', 'SFO']]) == ['JFK', 'MUC', 'LHR', 'SFO', 'SJC']
    assert find_itinerary([['JFK', 'SFO'], ['JFK', 'ATL'], ['SFO', 'ATL'], ['ATL', 'JFK'], ['ATL', 'SFO']]) == ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO']
    assert find_itinerary([['JFK', 'ATL']]) == ['JFK', 'ATL']
    assert find_itinerary([['JFK', 'A'], ['A', 'B'], ['B', 'C']]) == ['JFK', 'A', 'B', 'C']
    assert find_itinerary([['JFK', 'ATL'], ['ATL', 'JFK']]) == ['JFK', 'ATL', 'JFK']
    # --- large-input timing ---
    import time as _t
    airports = ['A' + str(i).zfill(3) for i in range(50)]
    big_tickets = [[airports[i], airports[i + 1]] for i in range(49)] + [['JFK', airports[0]]]
    _t0 = _t.perf_counter()
    find_itinerary(big_tickets)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf reconstruct-itinerary 51 tickets linear chain: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
