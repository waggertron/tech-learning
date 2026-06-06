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

def swap_pairs(head: ListNode | None) -> ListNode | None:
    dummy = ListNode(0, head)
    prev, cur = dummy, head
    while cur and cur.next:
        next_pair = cur.next.next
        prev.next = cur.next
        cur.next.next = cur
        cur.next = next_pair
        prev = cur
        cur = next_pair
    return dummy.next

assert to_list(swap_pairs(from_list([1,2,3,4]))) == [2,1,4,3]
assert to_list(swap_pairs(from_list([]))) == []
assert to_list(swap_pairs(from_list([1]))) == [1]
assert to_list(swap_pairs(from_list([1,2,3]))) == [2,1,3]
print("all tests pass")
