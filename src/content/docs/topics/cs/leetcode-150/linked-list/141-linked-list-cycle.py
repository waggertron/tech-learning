class ListNode:

    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert has_cycle(None) == False
    assert has_cycle(ListNode(1)) == False
    n1 = ListNode(1)
    n2 = ListNode(2)
    n3 = ListNode(3)
    n1.next = n2
    n2.next = n3
    assert has_cycle(n1) == False
    a = ListNode(3)
    b = ListNode(2)
    c = ListNode(0)
    d = ListNode(-4)
    a.next = b
    b.next = c
    c.next = d
    d.next = b
    assert has_cycle(a) == True
    x = ListNode(1)
    x.next = x
    assert has_cycle(x) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
