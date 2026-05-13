function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function accountsMerge(accounts: string[][]): string[][] {
    const parent = new Map<string, string>();
    const emailToName = new Map<string, string>();

    function find(x: string): string {
        if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
        return parent.get(x)!;
    }

    function union(a: string, b: string): void {
        parent.set(find(a), find(b));
    }

    for (const account of accounts) {
        const name = account[0];
        for (const email of account.slice(1)) {
            if (!parent.has(email)) parent.set(email, email);
            emailToName.set(email, name);
            union(account[1], email);
        }
    }

    const groups = new Map<string, string[]>();
    for (const email of parent.keys()) {
        const root = find(email);
        if (!groups.has(root)) groups.set(root, []);
        groups.get(root)!.push(email);
    }

    const result: string[][] = [];
    for (const [root, emails] of groups) {
        result.push([emailToName.get(root)!, ...emails.sort()]);
    }
    return result;
}

function normalize(result: string[][]): string {
    return JSON.stringify(result.map(row => [row[0], ...row.slice(1).sort()]).sort());
}

const a1 = [
    ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
    ['John', 'johnsmith@mail.com', 'john00@mail.com'],
    ['Mary', 'mary@mail.com'],
    ['John', 'johnnybravo@mail.com'],
];
const expected1 = [
    ['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com'],
    ['Mary', 'mary@mail.com'],
    ['John', 'johnnybravo@mail.com'],
];
assert(normalize(accountsMerge(a1)) === normalize(expected1));
assert(normalize(accountsMerge([['Alice', 'a@x.com']])) === normalize([['Alice', 'a@x.com']]));
assert(normalize(accountsMerge([['A', 'x@y.com', 'a@b.com'], ['A', 'x@y.com', 'c@d.com']])) === normalize([['A', 'a@b.com', 'c@d.com', 'x@y.com']]));
console.log('all tests pass');
