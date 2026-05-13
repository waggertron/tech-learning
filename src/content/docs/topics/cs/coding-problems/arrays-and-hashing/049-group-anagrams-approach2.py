from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        groups[key].append(s)
    return list(groups.values())

def normalize(result):
    return sorted(sorted(g) for g in result)

assert normalize(group_anagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])) == [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]
assert normalize(group_anagrams([''])) == [['']]
assert normalize(group_anagrams(['a'])) == [['a']]
assert normalize(group_anagrams(['abc', 'bca', 'cab'])) == [['abc', 'bca', 'cab']]
assert normalize(group_anagrams(['a', 'b', 'c'])) == [['a'], ['b'], ['c']]
print("all tests pass")
