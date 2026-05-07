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

def reverse_list(head):
    pass  # TODO: implement

def _run_tests():
    assert to_list(reverse_list(from_list([1, 2, 3, 4, 5]))) == [5, 4, 3, 2, 1]
    assert to_list(reverse_list(from_list([1, 2]))) == [2, 1]
    assert to_list(reverse_list(from_list([1]))) == [1]
    assert reverse_list(None) is None
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
    reverse_list(_head)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf reverse_list(1000 nodes): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
