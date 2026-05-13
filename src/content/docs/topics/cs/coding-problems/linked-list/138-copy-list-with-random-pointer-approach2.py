class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copy_random_list(head):
    if not head:
        return None
    old_to_new = {}
    cur = head
    while cur:
        old_to_new[cur] = Node(cur.val)
        cur = cur.next
    cur = head
    while cur:
        old_to_new[cur].next = old_to_new.get(cur.next)
        old_to_new[cur].random = old_to_new.get(cur.random)
        cur = cur.next
    return old_to_new[head]

assert copy_random_list(None) is None
n1 = Node(1); n1.random = n1
copy = copy_random_list(n1)
assert copy is not n1 and copy.val == 1 and copy.random is copy
a = Node(7); b = Node(13); a.next = b; b.random = a
copy = copy_random_list(a)
assert copy is not a and copy.val == 7 and copy.next.val == 13 and copy.next.random is copy
print("all tests pass")
