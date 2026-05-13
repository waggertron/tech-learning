class Node:
    __slots__ = ("key", "val", "prev", "next")
    def __init__(self, key=0, val=0):
        self.key = key; self.val = val
        self.prev = None; self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.head = Node(); self.tail = Node()
        self.head.next = self.tail; self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next; node.next.prev = node.prev

    def _add_to_front(self, node):
        node.prev = self.head; node.next = self.head.next
        self.head.next.prev = node; self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node); self._add_to_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]; node.val = value
            self._remove(node); self._add_to_front(node); return
        if len(self.cache) >= self.cap:
            lru = self.tail.prev
            self._remove(lru); del self.cache[lru.key]
        node = Node(key, value)
        self.cache[key] = node; self._add_to_front(node)

cache = LRUCache(2)
cache.put(1, 1); cache.put(2, 2)
assert cache.get(1) == 1
cache.put(3, 3)
assert cache.get(2) == -1
cache.put(4, 4)
assert cache.get(1) == -1
assert cache.get(3) == 3
assert cache.get(4) == 4
c1 = LRUCache(1)
c1.put(1, 10); assert c1.get(1) == 10
c1.put(2, 20); assert c1.get(1) == -1; assert c1.get(2) == 20
print("all tests pass")
