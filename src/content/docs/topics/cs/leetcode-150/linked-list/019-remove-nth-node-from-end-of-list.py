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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
