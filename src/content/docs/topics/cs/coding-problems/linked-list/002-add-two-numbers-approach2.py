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

def add_two_numbers(l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
    dummy = ListNode()
    tail = dummy
    carry = 0
    while l1 or l2 or carry:
        v = carry
        if l1:
            v += l1.val
            l1 = l1.next
        if l2:
            v += l2.val
            l2 = l2.next
        carry, digit = divmod(v, 10)
        tail.next = ListNode(digit)
        tail = tail.next
    return dummy.next

assert to_list(add_two_numbers(from_list([2,4,3]), from_list([5,6,4]))) == [7,0,8]
assert to_list(add_two_numbers(from_list([0]), from_list([0]))) == [0]
assert to_list(add_two_numbers(from_list([9,9,9,9,9,9,9]), from_list([9,9,9,9]))) == [8,9,9,9,0,0,0,1]
assert to_list(add_two_numbers(from_list([1]), from_list([2]))) == [3]
assert to_list(add_two_numbers(from_list([5]), from_list([5]))) == [0,1]
print("all tests pass")
