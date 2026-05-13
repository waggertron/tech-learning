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

func reverseKGroup(head *ListNode, k int) *ListNode {
	dummy := &ListNode{Next: head}
	groupPrev := dummy

	for {
		kth := groupPrev
		for i := 0; i < k; i++ {
			kth = kth.Next
			if kth == nil {
				return dummy.Next
			}
		}
		groupNext := kth.Next

		prev, curr := groupNext, groupPrev.Next
		for curr != groupNext {
			nxt := curr.Next
			curr.Next = prev
			prev = curr
			curr = nxt
		}

		tmp := groupPrev.Next
		groupPrev.Next = kth
		groupPrev = tmp
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
	assert(slicesEqual(listToSlice(reverseKGroup(makeList([]int{1, 2, 3, 4, 5}), 2)), []int{2, 1, 4, 3, 5}))
	assert(slicesEqual(listToSlice(reverseKGroup(makeList([]int{1, 2, 3, 4, 5}), 3)), []int{3, 2, 1, 4, 5}))
	assert(slicesEqual(listToSlice(reverseKGroup(makeList([]int{1, 2, 3, 4, 5, 6}), 3)), []int{3, 2, 1, 6, 5, 4}))
	assert(slicesEqual(listToSlice(reverseKGroup(makeList([]int{1, 2, 3}), 1)), []int{1, 2, 3}))
	assert(slicesEqual(listToSlice(reverseKGroup(makeList([]int{1, 2, 3}), 3)), []int{3, 2, 1}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
