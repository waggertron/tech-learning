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

func removeNthFromEnd(head *ListNode, n int) *ListNode {
	dummy := &ListNode{Next: head}
	slow, fast := dummy, dummy
	for i := 0; i <= n; i++ {
		fast = fast.Next
	}
	for fast != nil {
		slow = slow.Next
		fast = fast.Next
	}
	slow.Next = slow.Next.Next
	return dummy.Next
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
	assert(slicesEqual(listToSlice(removeNthFromEnd(makeList([]int{1, 2, 3, 4, 5}), 2)), []int{1, 2, 3, 5}))
	assert(slicesEqual(listToSlice(removeNthFromEnd(makeList([]int{1}), 1)), []int{}))
	assert(slicesEqual(listToSlice(removeNthFromEnd(makeList([]int{1, 2}), 1)), []int{1}))
	assert(slicesEqual(listToSlice(removeNthFromEnd(makeList([]int{1, 2}), 2)), []int{2}))
	assert(slicesEqual(listToSlice(removeNthFromEnd(makeList([]int{1, 2, 3, 4, 5}), 5)), []int{2, 3, 4, 5}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
