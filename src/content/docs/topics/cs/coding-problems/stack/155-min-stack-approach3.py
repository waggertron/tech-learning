class MinStack:
    def __init__(self):
        self.stack = []  # list of (value, running_min)

    def push(self, val: int) -> None:
        cur_min = val if not self.stack else min(val, self.stack[-1][1])
        self.stack.append((val, cur_min))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]

ms = MinStack()
ms.push(-2)
ms.push(0)
ms.push(-3)
assert ms.getMin() == -3
ms.pop()
assert ms.top() == 0
assert ms.getMin() == -2

ms2 = MinStack()
ms2.push(1)
ms2.push(2)
ms2.push(3)
assert ms2.getMin() == 1
ms2.pop()
assert ms2.getMin() == 1

ms3 = MinStack()
ms3.push(5)
assert ms3.top() == 5
assert ms3.getMin() == 5
print("all tests pass")
