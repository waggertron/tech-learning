class Node:
    __slots__ = ('key', 'val', 'prev', 'next')

    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:

    def __init__(self, capacity: int):
        pass  # TODO: implement

    def _remove(self, node):
        pass  # TODO: implement

    def _add_to_front(self, node):
        pass  # TODO: implement

    def get(self, key: int) -> int:
        pass  # TODO: implement

    def put(self, key: int, value: int) -> None:
        pass  # TODO: implement

def _run_tests():
    cache = LRUCache(2)
    cache.put(1, 1)
    cache.put(2, 2)
    assert cache.get(1) == 1
    cache.put(3, 3)
    assert cache.get(2) == -1
    cache.put(4, 4)
    assert cache.get(1) == -1
    assert cache.get(3) == 3
    assert cache.get(4) == 4
    c1 = LRUCache(1)
    c1.put(1, 10)
    assert c1.get(1) == 10
    c1.put(2, 20)
    assert c1.get(1) == -1
    assert c1.get(2) == 20
    c2 = LRUCache(2)
    c2.put(1, 1)
    c2.put(2, 2)
    c2.put(1, 100)
    c2.put(3, 3)
    assert c2.get(1) == 100
    assert c2.get(2) == -1
    assert c2.get(3) == 3
    # --- large-input timing ---
    import time as _t
    _cache = LRUCache(500)
    _t0 = _t.perf_counter()
    for _i in range(2000):
        if _i % 2 == 0:
            _cache.put(_i % 600, _i)
        else:
            _cache.get(_i % 600)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf LRUCache(capacity=500, 2000 get/put ops): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
