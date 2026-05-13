function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function alienOrder(words: string[]): string {
    const inDeg = new Map<string, number>();
    for (const w of words) for (const c of w) if (!inDeg.has(c)) inDeg.set(c, 0);
    const graph = new Map<string, Set<string>>();

    for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i], w2 = words[i + 1];
        if (w1.length > w2.length && w1.startsWith(w2)) return '';
        for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
            const a = w1[j], b = w2[j];
            if (a !== b) {
                if (!graph.has(a)) graph.set(a, new Set());
                if (!graph.get(a)!.has(b)) {
                    graph.get(a)!.add(b);
                    inDeg.set(b, (inDeg.get(b) ?? 0) + 1);
                }
                break;
            }
        }
    }

    const q: string[] = [];
    for (const [c, d] of inDeg) if (d === 0) q.push(c);
    const order: string[] = [];
    let head = 0;
    while (head < q.length) {
        const c = q[head++];
        order.push(c);
        for (const nb of (graph.get(c) ?? [])) {
            inDeg.set(nb, inDeg.get(nb)! - 1);
            if (inDeg.get(nb) === 0) q.push(nb);
        }
    }
    return order.length === inDeg.size ? order.join('') : '';
}

const r1 = alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt']);
assert(r1 === 'wertf', `got ${JSON.stringify(r1)}`);
const r2 = alienOrder(['z', 'x']);
assert(r2 === 'zx', `got ${JSON.stringify(r2)}`);
assert(alienOrder(['z', 'x', 'z']) === '');
assert(alienOrder(['abc', 'ab']) === '');
const r3 = alienOrder(['abc']);
assert(new Set(r3).size === 3 && r3.includes('a') && r3.includes('b') && r3.includes('c'));
console.log('all tests pass');
