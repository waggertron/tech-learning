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

def merge_k_lists(lists):
    pass  # TODO: implement

def _run_tests():
    result = merge_k_lists([from_list([1, 4, 5]), from_list([1, 3, 4]), from_list([2, 6])])
    assert to_list(result) == [1, 1, 2, 3, 4, 4, 5, 6]
    assert merge_k_lists([]) is None
    assert to_list(merge_k_lists([None])) == []
    assert to_list(merge_k_lists([from_list([1, 2, 3])])) == [1, 2, 3]
    assert to_list(merge_k_lists([from_list([1, 2]), None])) == [1, 2]
    # --- large-input timing ---
    import time as _t
    def _make_list(vals):
        if not vals: return None
        head = ListNode(vals[0])
        cur = head
        for v in vals[1:]: cur.next = ListNode(v); cur = cur.next
        return head
    _lists = [_make_list(list(range(i, i + 10))) for i in range(0, 100 * 10, 10)]
    _t0 = _t.perf_counter()
    merge_k_lists(_lists)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf merge_k_lists(k=100 lists of 10): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
