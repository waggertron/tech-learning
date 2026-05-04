class TimeMap:

    def __init__(self):
        pass  # TODO: implement

    def set(self, key: str, value: str, timestamp: int) -> None:
        pass  # TODO: implement

    def get(self, key: str, timestamp: int) -> str:
        pass  # TODO: implement

def _run_tests():
    store = TimeMap()
    store.set('foo', 'bar', 1)
    assert store.get('foo', 1) == 'bar'
    assert store.get('foo', 3) == 'bar'
    store.set('foo', 'bar2', 4)
    assert store.get('foo', 4) == 'bar2'
    assert store.get('foo', 5) == 'bar2'
    assert store.get('foo', 0) == ''
    assert store.get('missing', 1) == ''
    # --- large-input timing ---
    import time as _t
    _store = TimeMap()
    for i in range(100000):
        _store.set('key', f'val{i}', i + 1)
    _t0 = _t.perf_counter()
    for i in range(1000):
        _store.get('key', i * 100 + 1)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf TimeMap.get x1000 over 100000 entries: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
