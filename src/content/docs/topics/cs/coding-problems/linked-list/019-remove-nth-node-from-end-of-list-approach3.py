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

def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next

assert to_list(remove_nth_from_end(from_list([1,2,3,4,5]), 2)) == [1,2,3,5]
assert to_list(remove_nth_from_end(from_list([1]), 1)) == []
assert to_list(remove_nth_from_end(from_list([1,2]), 1)) == [1]
assert to_list(remove_nth_from_end(from_list([1,2]), 2)) == [2]
assert to_list(remove_nth_from_end(from_list([1,2,3,4,5]), 5)) == [2,3,4,5]
print("all tests pass")
