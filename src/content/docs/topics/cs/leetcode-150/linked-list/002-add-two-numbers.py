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

def add_two_numbers(l1, l2):
    pass  # TODO: implement

def _run_tests():
    assert to_list(add_two_numbers(from_list([2, 4, 3]), from_list([5, 6, 4]))) == [7, 0, 8]
    assert to_list(add_two_numbers(from_list([0]), from_list([0]))) == [0]
    assert to_list(add_two_numbers(from_list([9, 9, 9, 9, 9, 9, 9]), from_list([9, 9, 9, 9]))) == [8, 9, 9, 9, 0, 0, 0, 1]
    assert to_list(add_two_numbers(from_list([1]), from_list([2]))) == [3]
    assert to_list(add_two_numbers(from_list([5]), from_list([5]))) == [0, 1]
    # --- large-input timing ---
    import time as _t
    def _make_list(vals):
        if not vals: return None
        head = ListNode(vals[0])
        cur = head
        for v in vals[1:]: cur.next = ListNode(v); cur = cur.next
        return head
    _head1 = _make_list(list(range(1000)))
    _head2 = _make_list(list(range(1000)))
    _t0 = _t.perf_counter()
    add_two_numbers(_head1, _head2)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf add_two_numbers(1000-digit numbers): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
