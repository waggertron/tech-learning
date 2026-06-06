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

def reverse_list(head: ListNode | None) -> ListNode | None:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

assert to_list(reverse_list(from_list([1,2,3,4,5]))) == [5,4,3,2,1]
assert to_list(reverse_list(from_list([1,2]))) == [2,1]
assert to_list(reverse_list(from_list([1]))) == [1]
assert reverse_list(None) is None
print("all tests pass")
