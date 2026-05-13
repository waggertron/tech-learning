def partition_labels(s):
    last = {ch: i for i, ch in enumerate(s)}
    result = []
    start = end = 0
    for i, ch in enumerate(s):
        end = max(end, last[ch])
        if i == end:
            result.append(i - start + 1)
            start = i + 1
    return result

assert partition_labels('ababcbacadefegdehijhklij') == [9, 7, 8]
assert partition_labels('eccbbbbdec') == [10]
assert partition_labels('a') == [1]
assert partition_labels('abcd') == [1, 1, 1, 1]
assert partition_labels('aabb') == [2, 2]
print("all tests pass")
