function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findItinerary(tickets: string[][]): string[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(findItinerary([['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']])) === JSON.stringify(['JFK','MUC','LHR','SFO','SJC']));
    assert(JSON.stringify(findItinerary([['JFK','SFO'],['JFK','ATL'],['SFO','ATL'],['ATL','JFK'],['ATL','SFO']])) === JSON.stringify(['JFK','ATL','JFK','SFO','ATL','SFO']));
    assert(JSON.stringify(findItinerary([['JFK','ATL']])) === JSON.stringify(['JFK','ATL']));
    assert(JSON.stringify(findItinerary([['JFK','A'],['A','B'],['B','C']])) === JSON.stringify(['JFK','A','B','C']));
    assert(JSON.stringify(findItinerary([['JFK','ATL'],['ATL','JFK']])) === JSON.stringify(['JFK','ATL','JFK']));
    // perf
    const airports = Array.from({ length: 10_000 }, (_, i) => 'A' + String(i).padStart(5, '0'));
    const bigTickets: string[][] = airports.slice(0, 9999).map((a, i) => [a, airports[i + 1]]);
    bigTickets.push(['JFK', airports[0]]);
    const t0 = performance.now();
    findItinerary(bigTickets);
    console.log(`perf reconstruct-itinerary 10000 tickets linear chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
