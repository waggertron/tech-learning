function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findItinerary(tickets: string[][]): string[] {
    const graph = new Map<string, string[]>();
    // sort descending so pop() from end gives lexicographically smallest
    const sorted = [...tickets].sort((a, b) => {
        const cmpSrc = b[0].localeCompare(a[0]);
        return cmpSrc !== 0 ? cmpSrc : b[1].localeCompare(a[1]);
    });
    for (const [src, dst] of sorted) {
        if (!graph.has(src)) graph.set(src, []);
        graph.get(src)!.push(dst);
    }

    const itinerary: string[] = [];
    const stack: string[] = ['JFK'];
    while (stack.length > 0) {
        const top = stack[stack.length - 1];
        const neighbors = graph.get(top);
        if (neighbors && neighbors.length > 0) {
            stack.push(neighbors.pop()!);
        } else {
            itinerary.push(stack.pop()!);
        }
    }
    return itinerary.reverse();
}

assert(JSON.stringify(findItinerary([['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']])) === JSON.stringify(['JFK','MUC','LHR','SFO','SJC']));
assert(JSON.stringify(findItinerary([['JFK','SFO'],['JFK','ATL'],['SFO','ATL'],['ATL','JFK'],['ATL','SFO']])) === JSON.stringify(['JFK','ATL','JFK','SFO','ATL','SFO']));
assert(JSON.stringify(findItinerary([['JFK','ATL']])) === JSON.stringify(['JFK','ATL']));
assert(JSON.stringify(findItinerary([['JFK','A'],['A','B'],['B','C']])) === JSON.stringify(['JFK','A','B','C']));
assert(JSON.stringify(findItinerary([['JFK','ATL'],['ATL','JFK']])) === JSON.stringify(['JFK','ATL','JFK']));
console.log('all tests pass');
