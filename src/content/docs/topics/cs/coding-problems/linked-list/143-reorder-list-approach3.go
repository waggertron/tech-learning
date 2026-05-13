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

func reorderList(head *ListNode) {
	if head == nil || head.Next == nil {
		return
	}
	// 1. Find middle
	slow, fast := head, head
	for fast.Next != nil && fast.Next.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	// 2. Reverse second half
	var prev *ListNode
	curr := slow.Next
	slow.Next = nil
	for curr != nil {
		nxt := curr.Next
		curr.Next = prev
		prev = curr
		curr = nxt
	}
	second := prev
	// 3. Weave
	first := head
	for second != nil {
		t1 := first.Next
		t2 := second.Next
		first.Next = second
		second.Next = t1
		first = t1
		second = t2
	}
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

func listToSlice(head *ListNode) []int {
	var result []int
	for head != nil {
		result = append(result, head.Val)
		head = head.Next
	}
	return result
}

func slicesEqual(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func runTests() {
	h1 := makeList([]int{1, 2, 3, 4})
	reorderList(h1)
	assert(slicesEqual(listToSlice(h1), []int{1, 4, 2, 3}))

	h2 := makeList([]int{1, 2, 3, 4, 5})
	reorderList(h2)
	assert(slicesEqual(listToSlice(h2), []int{1, 5, 2, 4, 3}))

	h3 := makeList([]int{1})
	reorderList(h3)
	assert(slicesEqual(listToSlice(h3), []int{1}))

	h4 := makeList([]int{1, 2})
	reorderList(h4)
	assert(slicesEqual(listToSlice(h4), []int{1, 2}))

	fmt.Println("all tests pass")
}

func main() { runTests() }
