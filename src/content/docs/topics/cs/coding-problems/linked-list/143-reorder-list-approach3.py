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

def reorder_list(head) -> None:
    if not head or not head.next:
        return
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    prev, curr = None, slow.next
    slow.next = None
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    second = prev
    first = head
    while second:
        t1 = first.next
        t2 = second.next
        first.next = second
        second.next = t1
        first = t1
        second = t2

h = from_list([1,2,3,4]); reorder_list(h); assert to_list(h) == [1,4,2,3]
h = from_list([1,2,3,4,5]); reorder_list(h); assert to_list(h) == [1,5,2,4,3]
h = from_list([1]); reorder_list(h); assert to_list(h) == [1]
h = from_list([1,2]); reorder_list(h); assert to_list(h) == [1,2]
print("all tests pass")
