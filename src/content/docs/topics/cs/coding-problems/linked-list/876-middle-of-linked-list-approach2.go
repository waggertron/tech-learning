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

func middleNode(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	return slow
}

func makeList(vals []int) *ListNode {
	if len(vals) == 0 {
		return nil
	}
	head := &ListNode{Val: vals[0]}
	cur := head
	for _, v := range vals[1:] {
		cur.Next = &ListNode{Val: v}
		cur = cur.Next
	}
	return head
}

func runTests() {
	assert(middleNode(makeList([]int{1, 2, 3, 4, 5})).Val == 3)
	assert(middleNode(makeList([]int{1, 2, 3, 4, 5, 6})).Val == 4)
	assert(middleNode(makeList([]int{1, 2})).Val == 2)
	assert(middleNode(makeList([]int{1})).Val == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
