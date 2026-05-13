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
	// TODO: implement
	return nil
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
