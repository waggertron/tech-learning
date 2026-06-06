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

def middle_node(head: ListNode | None) -> ListNode | None:
    pass  # TODO: implement

def _run_tests():
    # Odd length
    assert middle_node(from_list([1, 2, 3, 4, 5])).val == 3
    # Even length: second middle
    assert middle_node(from_list([1, 2, 3, 4, 5, 6])).val == 4
    # Two nodes
    assert middle_node(from_list([1, 2])).val == 2
    # Single node
    assert middle_node(from_list([1])).val == 1
    # --- large-input timing ---
    import time as _t
    _head = from_list(list(range(1000)))
    _t0 = _t.perf_counter()
    middle_node(_head)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf middle_node(1000 nodes): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
