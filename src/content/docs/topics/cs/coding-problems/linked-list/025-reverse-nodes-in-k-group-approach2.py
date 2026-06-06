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

def reverse_k_group(head: ListNode | None, k: int) -> ListNode | None:
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next
        prev, curr = group_next, group_prev.next
        while curr is not group_next:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        tmp = group_prev.next
        group_prev.next = kth
        group_prev = tmp

assert to_list(reverse_k_group(from_list([1,2,3,4,5]), 2)) == [2,1,4,3,5]
assert to_list(reverse_k_group(from_list([1,2,3,4,5]), 3)) == [3,2,1,4,5]
assert to_list(reverse_k_group(from_list([1,2,3,4,5,6]), 3)) == [3,2,1,6,5,4]
assert to_list(reverse_k_group(from_list([1,2,3]), 1)) == [1,2,3]
assert to_list(reverse_k_group(from_list([1,2,3]), 3)) == [3,2,1]
print("all tests pass")
