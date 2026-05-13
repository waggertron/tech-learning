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

def swap_pairs(head):
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
