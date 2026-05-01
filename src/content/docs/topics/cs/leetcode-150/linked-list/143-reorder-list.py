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

def reorder_list(head) -> None:
    pass  # TODO: implement

def _run_tests():
    h = from_list([1, 2, 3, 4])
    reorder_list(h)
    assert to_list(h) == [1, 4, 2, 3]
    h = from_list([1, 2, 3, 4, 5])
    reorder_list(h)
    assert to_list(h) == [1, 5, 2, 4, 3]
    h = from_list([1])
    reorder_list(h)
    assert to_list(h) == [1]
    h = from_list([1, 2])
    reorder_list(h)
    assert to_list(h) == [1, 2]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
