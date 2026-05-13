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

func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
	// TODO: implement
	return nil
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
	assert(slicesEqual(listToSlice(mergeTwoLists(makeList([]int{1, 2, 4}), makeList([]int{1, 3, 4}))), []int{1, 1, 2, 3, 4, 4}))
	assert(slicesEqual(listToSlice(mergeTwoLists(nil, nil)), []int{}))
	assert(slicesEqual(listToSlice(mergeTwoLists(nil, makeList([]int{0}))), []int{0}))
	assert(slicesEqual(listToSlice(mergeTwoLists(makeList([]int{1, 3, 5}), nil)), []int{1, 3, 5}))
	assert(slicesEqual(listToSlice(mergeTwoLists(makeList([]int{1, 2, 3}), makeList([]int{4, 5, 6, 7}))), []int{1, 2, 3, 4, 5, 6, 7}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
