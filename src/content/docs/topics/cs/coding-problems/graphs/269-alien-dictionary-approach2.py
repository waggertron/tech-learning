from collections import defaultdict, deque

def alien_order(words: list[str]) -> str:
    in_deg = {c: 0 for w in words for c in w}
    graph = defaultdict(set)

    for w1, w2 in zip(words, words[1:]):
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        for a, b in zip(w1, w2):
            if a != b:
                if b not in graph[a]:
                    graph[a].add(b)
                    in_deg[b] += 1
                break

    q = deque([c for c, d in in_deg.items() if d == 0])
    order = []
    while q:
        c = q.popleft()
        order.append(c)
        for nb in graph[c]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                q.append(nb)

    return "".join(order) if len(order) == len(in_deg) else ""

result = alien_order(["wrt", "wrf", "er", "ett", "rftt"])
assert result == "wertf", f"got {result!r}"
result = alien_order(["z", "x"])
assert result == "zx", f"got {result!r}"
assert alien_order(["z", "x", "z"]) == ""
assert alien_order(["abc", "ab"]) == ""
result = alien_order(["abc"])
assert set(result) == set("abc"), f"got {result!r}"
print("all tests pass")
