from __future__ import annotations

class ListNode:
    def __init__(self, val: int = 0, next: ListNode | None = None) -> None:
        self.val = val
        self.next = next

def from_list(vals: list[int]) -> ListNode | None:
    dummy = ListNode()
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def middle_node(head: ListNode | None) -> ListNode | None:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

assert middle_node(from_list([1,2,3,4,5])).val == 3
assert middle_node(from_list([1,2,3,4,5,6])).val == 4
assert middle_node(from_list([1,2])).val == 2
assert middle_node(from_list([1])).val == 1
print("all tests pass")
