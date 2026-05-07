class ListNode:

    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

def from_list(vals):
    dummy = ListNode()
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def remove_nth_from_end(head, n):
    pass  # TODO: implement

def _run_tests():
    assert to_list(remove_nth_from_end(from_list([1, 2, 3, 4, 5]), 2)) == [1, 2, 3, 5]
    assert to_list(remove_nth_from_end(from_list([1]), 1)) == []
    assert to_list(remove_nth_from_end(from_list([1, 2]), 1)) == [1]
    assert to_list(remove_nth_from_end(from_list([1, 2]), 2)) == [2]
    assert to_list(remove_nth_from_end(from_list([1, 2, 3, 4, 5]), 5)) == [2, 3, 4, 5]
    # --- large-input timing ---
    import time as _t
    def _make_list(vals):
        if not vals: return None
        head = ListNode(vals[0])
        cur = head
        for v in vals[1:]: cur.next = ListNode(v); cur = cur.next
        return head
    _head = _make_list(list(range(1000)))
    _t0 = _t.perf_counter()
    remove_nth_from_end(_head, 500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf remove_nth_from_end(list of 1000, n=500): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
