from collections import defaultdict, deque

def ladder_length(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
    L = len(beginWord)
    patterns = defaultdict(list)
    for w in wordList:
        for i in range(L):
            patterns[w[:i] + "*" + w[i+1:]].append(w)
    q = deque([(beginWord, 1)])
    visited = {beginWord}
    while q:
        word, dist = q.popleft()
        if word == endWord:
            return dist
        for i in range(L):
            key = word[:i] + "*" + word[i+1:]
            for nb in patterns[key]:
                if nb not in visited:
                    visited.add(nb)
                    q.append((nb, dist + 1))
            patterns[key] = []
    return 0

assert ladder_length("hit", "cog", ["hot","dot","dog","lot","log","cog"]) == 5
assert ladder_length("hit", "cot", ["hot","dot","dog","lot","log","cog"]) == 0
assert ladder_length("hot", "dot", ["dot","lot"]) == 2
assert ladder_length("hit", "cog", ["hot","dot","dog","lot","log"]) == 0
assert ladder_length("a", "c", ["a","b","c"]) == 2
print("all tests pass")
