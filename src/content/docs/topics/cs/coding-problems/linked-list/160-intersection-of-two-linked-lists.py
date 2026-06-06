from __future__ import annotations

class ListNode:
    def __init__(self, val: int = 0, next: ListNode | None = None) -> None:
        self.val = val
        self.next = next

def get_intersection_node(headA: ListNode | None, headB: ListNode | None) -> ListNode | None:
    pass  # TODO: implement

def _run_tests():
    # Shared tail: A=[4,1,8,4,5], B=[5,6,1,8,4,5], intersect at 8
    shared = ListNode(8, ListNode(4, ListNode(5)))
    headA = ListNode(4, ListNode(1, shared))
    headB = ListNode(5, ListNode(6, ListNode(1, shared)))
    assert get_intersection_node(headA, headB) is shared

    # No intersection
    a = ListNode(2, ListNode(6, ListNode(4)))
    b = ListNode(1, ListNode(5))
    assert get_intersection_node(a, b) is None

    # Both empty
    assert get_intersection_node(None, None) is None

    # One empty
    assert get_intersection_node(ListNode(1), None) is None

    # --- large-input timing ---
    import time as _t
    def _make_list(n):
        dummy = ListNode()
        cur = dummy
        for i in range(n):
            cur.next = ListNode(i)
            cur = cur.next
        return dummy.next
    _a = _make_list(500)
    _b = _make_list(500)
    _t0 = _t.perf_counter()
    get_intersection_node(_a, _b)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf get_intersection_node(500+500 nodes, no intersect): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
