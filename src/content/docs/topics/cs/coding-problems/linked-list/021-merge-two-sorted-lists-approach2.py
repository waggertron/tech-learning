from __future__ import annotations

class ListNode:
    def __init__(self, val: int = 0, next: ListNode | None = None) -> None:
        self.val = val
        self.next = next

def to_list(head: ListNode | None) -> list[int]:
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

def from_list(vals: list[int]) -> ListNode | None:
    dummy = ListNode()
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def merge_two_lists(l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next, l1 = l1, l1.next
        else:
            tail.next, l2 = l2, l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next

assert to_list(merge_two_lists(from_list([1,2,4]), from_list([1,3,4]))) == [1,1,2,3,4,4]
assert to_list(merge_two_lists(None, None)) == []
assert to_list(merge_two_lists(None, from_list([0]))) == [0]
assert to_list(merge_two_lists(from_list([1,3,5]), None)) == [1,3,5]
assert to_list(merge_two_lists(from_list([1,2,3]), from_list([4,5,6,7]))) == [1,2,3,4,5,6,7]
print("all tests pass")
