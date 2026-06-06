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

def merge_two(l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
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

def merge_k_lists(lists: list[ListNode | None]) -> ListNode | None:
    if not lists:
        return None
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            a = lists[i]
            b = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge_two(a, b))
        lists = merged
    return lists[0]

result = merge_k_lists([from_list([1,4,5]), from_list([1,3,4]), from_list([2,6])])
assert to_list(result) == [1,1,2,3,4,4,5,6]
assert merge_k_lists([]) is None
assert to_list(merge_k_lists([None])) == []
assert to_list(merge_k_lists([from_list([1,2,3])])) == [1,2,3]
assert to_list(merge_k_lists([from_list([1,2]), None])) == [1,2]
print("all tests pass")
