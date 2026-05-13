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

func getIntersectionNode(headA, headB *ListNode) *ListNode {
	// TODO: implement
	return nil
}

func runTests() {
	shared := &ListNode{Val: 8, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}}
	headA := &ListNode{Val: 4, Next: &ListNode{Val: 1, Next: shared}}
	headB := &ListNode{Val: 5, Next: &ListNode{Val: 6, Next: &ListNode{Val: 1, Next: shared}}}
	assert(getIntersectionNode(headA, headB) == shared)

	a := &ListNode{Val: 2, Next: &ListNode{Val: 6, Next: &ListNode{Val: 4}}}
	b := &ListNode{Val: 1, Next: &ListNode{Val: 5}}
	assert(getIntersectionNode(a, b) == nil)

	assert(getIntersectionNode(nil, nil) == nil)
	assert(getIntersectionNode(&ListNode{Val: 1}, nil) == nil)

	fmt.Println("all tests pass")
}

func main() { runTests() }
