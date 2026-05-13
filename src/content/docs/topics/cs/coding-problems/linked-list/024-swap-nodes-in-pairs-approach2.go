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

func swapPairs(head *ListNode) *ListNode {
	dummy := &ListNode{Next: head}
	prev, cur := dummy, head
	for cur != nil && cur.Next != nil {
		nextPair := cur.Next.Next
		prev.Next = cur.Next
		cur.Next.Next = cur
		cur.Next = nextPair
		prev = cur
		cur = nextPair
	}
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
	assert(slicesEqual(listToSlice(swapPairs(makeList([]int{1, 2, 3, 4}))), []int{2, 1, 4, 3}))
	assert(slicesEqual(listToSlice(swapPairs(nil)), []int{}))
	assert(slicesEqual(listToSlice(swapPairs(makeList([]int{1}))), []int{1}))
	assert(slicesEqual(listToSlice(swapPairs(makeList([]int{1, 2, 3}))), []int{2, 1, 3}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
