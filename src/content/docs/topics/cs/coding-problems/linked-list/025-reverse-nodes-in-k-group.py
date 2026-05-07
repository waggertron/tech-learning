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

def reverse_k_group(head, k):
    pass  # TODO: implement

def _run_tests():
    assert to_list(reverse_k_group(from_list([1, 2, 3, 4, 5]), 2)) == [2, 1, 4, 3, 5]
    assert to_list(reverse_k_group(from_list([1, 2, 3, 4, 5]), 3)) == [3, 2, 1, 4, 5]
    assert to_list(reverse_k_group(from_list([1, 2, 3, 4, 5, 6]), 3)) == [3, 2, 1, 6, 5, 4]
    assert to_list(reverse_k_group(from_list([1, 2, 3]), 1)) == [1, 2, 3]
    assert to_list(reverse_k_group(from_list([1, 2, 3]), 3)) == [3, 2, 1]
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
    reverse_k_group(_head, 4)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf reverse_k_group(1000 nodes, k=4): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
