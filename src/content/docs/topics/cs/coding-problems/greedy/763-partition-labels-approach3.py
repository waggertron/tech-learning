def partition_labels(s: str) -> list[int]:
    first, last = {}, {}
    for i, ch in enumerate(s):
        first.setdefault(ch, i)
        last[ch] = i
    intervals = sorted((first[ch], last[ch]) for ch in first)
    merged = []
    for a, b in intervals:
        if merged and a <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], b))
        else:
            merged.append((a, b))
    return [b - a + 1 for a, b in merged]

assert partition_labels('ababcbacadefegdehijhklij') == [9, 7, 8]
assert partition_labels('eccbbbbdec') == [10]
assert partition_labels('a') == [1]
assert partition_labels('abcd') == [1, 1, 1, 1]
assert partition_labels('aabb') == [2, 2]
print("all tests pass")
