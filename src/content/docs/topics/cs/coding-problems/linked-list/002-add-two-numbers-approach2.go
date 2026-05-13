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

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	carry := 0
	for l1 != nil || l2 != nil || carry != 0 {
		v := carry
		if l1 != nil {
			v += l1.Val
			l1 = l1.Next
		}
		if l2 != nil {
			v += l2.Val
			l2 = l2.Next
		}
		carry = v / 10
		tail.Next = &ListNode{Val: v % 10}
		tail = tail.Next
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
	assert(slicesEqual(listToSlice(addTwoNumbers(makeList([]int{2, 4, 3}), makeList([]int{5, 6, 4}))), []int{7, 0, 8}))
	assert(slicesEqual(listToSlice(addTwoNumbers(makeList([]int{0}), makeList([]int{0}))), []int{0}))
	assert(slicesEqual(listToSlice(addTwoNumbers(makeList([]int{9, 9, 9, 9, 9, 9, 9}), makeList([]int{9, 9, 9, 9}))), []int{8, 9, 9, 9, 0, 0, 0, 1}))
	assert(slicesEqual(listToSlice(addTwoNumbers(makeList([]int{1}), makeList([]int{2}))), []int{3}))
	assert(slicesEqual(listToSlice(addTwoNumbers(makeList([]int{5}), makeList([]int{5}))), []int{0, 1}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
