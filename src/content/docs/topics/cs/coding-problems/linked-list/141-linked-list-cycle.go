package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
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

func hasCycle(head *ListNode) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(hasCycle(nil) == false)
	assert(hasCycle(&ListNode{Val: 1}) == false)

	n1 := &ListNode{Val: 1}
	n2 := &ListNode{Val: 2}
	n3 := &ListNode{Val: 3}
	n1.Next = n2
	n2.Next = n3
	assert(hasCycle(n1) == false)

	a := &ListNode{Val: 3}
	b := &ListNode{Val: 2}
	c := &ListNode{Val: 0}
	d := &ListNode{Val: -4}
	a.Next = b
	b.Next = c
	c.Next = d
	d.Next = b
	assert(hasCycle(a) == true)

	x := &ListNode{Val: 1}
	x.Next = x
	assert(hasCycle(x) == true)

	fmt.Println("all tests pass")
}

func main() { runTests() }
