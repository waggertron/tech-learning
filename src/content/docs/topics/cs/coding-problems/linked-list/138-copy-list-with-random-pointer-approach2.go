package main

import "fmt"

type Node struct {
	Val    int
	Next   *Node
	Random *Node
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func copyRandomList(head *Node) *Node {
	if head == nil {
		return nil
	}
	oldToNew := make(map[*Node]*Node)
	cur := head
	for cur != nil {
		oldToNew[cur] = &Node{Val: cur.Val}
		cur = cur.Next
	}
	cur = head
	for cur != nil {
		if cur.Next != nil {
			oldToNew[cur].Next = oldToNew[cur.Next]
		}
		if cur.Random != nil {
			oldToNew[cur].Random = oldToNew[cur.Random]
		}
		cur = cur.Next
	}
	return oldToNew[head]
}

func runTests() {
	assert(copyRandomList(nil) == nil)

	n1 := &Node{Val: 1}
	n1.Random = n1
	copy1 := copyRandomList(n1)
	assert(copy1 != nil && copy1 != n1)
	assert(copy1.Val == 1)
	assert(copy1.Random == copy1)

	a := &Node{Val: 7}
	b := &Node{Val: 13}
	a.Next = b
	b.Random = a
	copy2 := copyRandomList(a)
	assert(copy2 != nil && copy2 != a)
	assert(copy2.Val == 7)
	assert(copy2.Next.Val == 13)
	assert(copy2.Next.Random == copy2)

	fmt.Println("all tests pass")
}

func main() { runTests() }
