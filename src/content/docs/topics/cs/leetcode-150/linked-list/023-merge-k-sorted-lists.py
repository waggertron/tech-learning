import heapq

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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
