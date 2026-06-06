from __future__ import annotations

class ListNode:
    def __init__(self, val: int = 0, next: ListNode | None = None) -> None:
        self.val = val
        self.next = next

def to_list(head: ListNode | None) -> list[int]:
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

def from_list(vals: list[int]) -> ListNode | None:
    dummy = ListNode()
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def swap_pairs(head: ListNode | None) -> ListNode | None:
    pass  # TODO: implement

def _run_tests():
    assert to_list(swap_pairs(from_list([1, 2, 3, 4]))) == [2, 1, 4, 3]
    assert to_list(swap_pairs(from_list([]))) == []
    assert to_list(swap_pairs(from_list([1]))) == [1]
    assert to_list(swap_pairs(from_list([1, 2, 3]))) == [2, 1, 3]
    # --- large-input timing ---
    import time as _t
    _head = from_list(list(range(1000)))
    _t0 = _t.perf_counter()
    swap_pairs(_head)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf swap_pairs(1000 nodes): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
