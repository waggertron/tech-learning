class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def get_intersection_node(headA, headB):
    pA, pB = headA, headB
    while pA is not pB:
        pA = pA.next if pA else headB
        pB = pB.next if pB else headA
    return pA

shared = ListNode(8, ListNode(4, ListNode(5)))
headA = ListNode(4, ListNode(1, shared))
headB = ListNode(5, ListNode(6, ListNode(1, shared)))
assert get_intersection_node(headA, headB) is shared
a = ListNode(2, ListNode(6, ListNode(4)))
b = ListNode(1, ListNode(5))
assert get_intersection_node(a, b) is None
assert get_intersection_node(None, None) is None
assert get_intersection_node(ListNode(1), None) is None
print("all tests pass")
