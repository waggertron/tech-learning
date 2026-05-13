package main

import "fmt"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
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

func invertTree(root *TreeNode) *TreeNode {
	// TODO: implement
	return nil
}

func treeToSlice(root *TreeNode) []int {
	if root == nil {
		return []int{}
	}
	result := []int{}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		if node != nil {
			result = append(result, node.Val)
			queue = append(queue, node.Left)
			queue = append(queue, node.Right)
		}
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
	root := &TreeNode{Val: 4,
		Left:  &TreeNode{Val: 2, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 7, Left: &TreeNode{Val: 6}, Right: &TreeNode{Val: 9}},
	}
	result := invertTree(root)
	assert(result != nil)
	assert(result.Val == 4)
	assert(result.Left.Val == 7)
	assert(result.Right.Val == 2)
	assert(result.Left.Left.Val == 9)
	assert(result.Left.Right.Val == 6)
	assert(result.Right.Left.Val == 3)
	assert(result.Right.Right.Val == 1)

	assert(invertTree(nil) == nil)

	single := &TreeNode{Val: 1}
	r2 := invertTree(single)
	assert(r2.Val == 1)

	fmt.Println("all tests pass")
}

func main() { runTests() }
