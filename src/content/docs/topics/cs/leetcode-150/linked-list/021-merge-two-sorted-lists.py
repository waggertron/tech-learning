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

def merge_two_lists(l1, l2):
    pass  # TODO: implement

def _run_tests():
    assert to_list(merge_two_lists(from_list([1, 2, 4]), from_list([1, 3, 4]))) == [1, 1, 2, 3, 4, 4]
    assert to_list(merge_two_lists(None, None)) == []
    assert to_list(merge_two_lists(None, from_list([0]))) == [0]
    assert to_list(merge_two_lists(from_list([1, 3, 5]), None)) == [1, 3, 5]
    assert to_list(merge_two_lists(from_list([1, 2, 3]), from_list([4, 5, 6, 7]))) == [1, 2, 3, 4, 5, 6, 7]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
