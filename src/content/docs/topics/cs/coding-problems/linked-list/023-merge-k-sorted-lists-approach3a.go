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

func mergeTwo(l1, l2 *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	for l1 != nil && l2 != nil {
		if l1.Val <= l2.Val {
			tail.Next = l1
			l1 = l1.Next
		} else {
			tail.Next = l2
			l2 = l2.Next
		}
		tail = tail.Next
	}
	if l1 != nil {
		tail.Next = l1
	} else {
		tail.Next = l2
	}
	return dummy.Next
}

func mergeKLists(lists []*ListNode) *ListNode {
	if len(lists) == 0 {
		return nil
	}
	for len(lists) > 1 {
		var merged []*ListNode
		for i := 0; i < len(lists); i += 2 {
			a := lists[i]
			var b *ListNode
			if i+1 < len(lists) {
				b = lists[i+1]
			}
			merged = append(merged, mergeTwo(a, b))
		}
		lists = merged
	}
	return lists[0]
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
	result := mergeKLists([]*ListNode{makeList([]int{1, 4, 5}), makeList([]int{1, 3, 4}), makeList([]int{2, 6})})
	assert(slicesEqual(listToSlice(result), []int{1, 1, 2, 3, 4, 4, 5, 6}))
	assert(mergeKLists([]*ListNode{}) == nil)
	assert(slicesEqual(listToSlice(mergeKLists([]*ListNode{nil})), []int{}))
	assert(slicesEqual(listToSlice(mergeKLists([]*ListNode{makeList([]int{1, 2, 3})})), []int{1, 2, 3}))
	assert(slicesEqual(listToSlice(mergeKLists([]*ListNode{makeList([]int{1, 2}), nil})), []int{1, 2}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
