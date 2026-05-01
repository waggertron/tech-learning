def find_itinerary(tickets):
    pass  # TODO: implement

def _run_tests():
    assert find_itinerary([['MUC', 'LHR'], ['JFK', 'MUC'], ['SFO', 'SJC'], ['LHR', 'SFO']]) == ['JFK', 'MUC', 'LHR', 'SFO', 'SJC']
    assert find_itinerary([['JFK', 'SFO'], ['JFK', 'ATL'], ['SFO', 'ATL'], ['ATL', 'JFK'], ['ATL', 'SFO']]) == ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO']
    assert find_itinerary([['JFK', 'ATL']]) == ['JFK', 'ATL']
    assert find_itinerary([['JFK', 'A'], ['A', 'B'], ['B', 'C']]) == ['JFK', 'A', 'B', 'C']
    assert find_itinerary([['JFK', 'ATL'], ['ATL', 'JFK']]) == ['JFK', 'ATL', 'JFK']
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
