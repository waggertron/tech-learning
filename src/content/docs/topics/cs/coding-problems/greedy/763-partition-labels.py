def partition_labels(s):
    pass  # TODO: implement

def _run_tests():
    assert partition_labels('ababcbacadefegdehijhklij') == [9, 7, 8]
    assert partition_labels('eccbbbbdec') == [10]
    assert partition_labels('a') == [1]
    assert partition_labels('abcd') == [1, 1, 1, 1]
    assert partition_labels('aabb') == [2, 2]
    # --- large-input timing ---
    import time as _t
    import string as _string
    _t0 = _t.perf_counter()
    partition_labels((_string.ascii_lowercase * 385)[:10000])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf partition_labels(n=10000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
