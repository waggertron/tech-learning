function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap using a sorted array for simplicity in browser TS
class MinHeap {
    private data: string[] = [];
    push(val: string): void {
        this.data.push(val);
        this.data.sort();
    }
    pop(): string {
        return this.data.shift()!;
    }
    get size(): number { return this.data.length; }
}

function findItinerary(tickets: string[][]): string[] {
    const graph = new Map<string, MinHeap>();
    for (const [src, dst] of tickets) {
        if (!graph.has(src)) graph.set(src, new MinHeap());
        graph.get(src)!.push(dst);
    }

    const itinerary: string[] = [];
    function dfs(node: string): void {
        const heap = graph.get(node);
        while (heap && heap.size > 0) {
            const nb = heap.pop();
            dfs(nb);
        }
        itinerary.push(node);
    }

    dfs('JFK');
    return itinerary.reverse();
}

assert(JSON.stringify(findItinerary([['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']])) === JSON.stringify(['JFK','MUC','LHR','SFO','SJC']));
assert(JSON.stringify(findItinerary([['JFK','SFO'],['JFK','ATL'],['SFO','ATL'],['ATL','JFK'],['ATL','SFO']])) === JSON.stringify(['JFK','ATL','JFK','SFO','ATL','SFO']));
assert(JSON.stringify(findItinerary([['JFK','ATL']])) === JSON.stringify(['JFK','ATL']));
assert(JSON.stringify(findItinerary([['JFK','A'],['A','B'],['B','C']])) === JSON.stringify(['JFK','A','B','C']));
assert(JSON.stringify(findItinerary([['JFK','ATL'],['ATL','JFK']])) === JSON.stringify(['JFK','ATL','JFK']));
console.log('all tests pass');
