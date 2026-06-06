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
    if not l1:
        return l2
    if not l2:
        return l1
    if l1.val <= l2.val:
        l1.next = merge_two_lists(l1.next, l2)
        return l1
    l2.next = merge_two_lists(l1, l2.next)
    return l2

assert to_list(merge_two_lists(from_list([1,2,4]), from_list([1,3,4]))) == [1,1,2,3,4,4]
assert to_list(merge_two_lists(None, None)) == []
assert to_list(merge_two_lists(None, from_list([0]))) == [0]
assert to_list(merge_two_lists(from_list([1,3,5]), None)) == [1,3,5]
assert to_list(merge_two_lists(from_list([1,2,3]), from_list([4,5,6,7]))) == [1,2,3,4,5,6,7]
print("all tests pass")
