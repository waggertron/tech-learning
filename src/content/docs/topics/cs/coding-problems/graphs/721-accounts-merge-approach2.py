from collections import defaultdict

def accounts_merge(accounts):
    parent = {}

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(a, b):
        parent[find(a)] = find(b)

    email_to_name = {}

    for account in accounts:
        name = account[0]
        for email in account[1:]:
            if email not in parent:
                parent[email] = email
            email_to_name[email] = name
            union(account[1], email)

    groups = defaultdict(list)
    for email in parent:
        groups[find(email)].append(email)

    return [[email_to_name[root]] + sorted(emails) for root, emails in groups.items()]


def normalize(result):
    return sorted([row[0:1] + sorted(row[1:]) for row in result])

a1 = [
    ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
    ["John", "johnsmith@mail.com", "john00@mail.com"],
    ["Mary", "mary@mail.com"],
    ["John", "johnnybravo@mail.com"],
]
r1 = normalize(accounts_merge(a1))
expected1 = normalize([
    ["John", "john00@mail.com", "john_newyork@mail.com", "johnsmith@mail.com"],
    ["Mary", "mary@mail.com"],
    ["John", "johnnybravo@mail.com"],
])
assert r1 == expected1, f"Expected {expected1}, got {r1}"
a2 = [["Alice", "a@x.com"]]
assert normalize(accounts_merge(a2)) == [["Alice", "a@x.com"]]
a3 = [["A", "x@y.com", "a@b.com"], ["A", "x@y.com", "c@d.com"]]
assert normalize(accounts_merge(a3)) == [["A", "a@b.com", "c@d.com", "x@y.com"]]
print("all tests pass")
