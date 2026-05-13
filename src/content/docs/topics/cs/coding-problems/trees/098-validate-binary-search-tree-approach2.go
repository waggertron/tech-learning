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

func isValidBST(root *TreeNode) bool {
	prev := -1 << 62 // sentinel for "no previous"
	hasPrev := false

	var inorder func(node *TreeNode) bool
	inorder = func(node *TreeNode) bool {
		if node == nil {
			return true
		}
		if !inorder(node.Left) {
			return false
		}
		if hasPrev && node.Val <= prev {
			return false
		}
		prev = node.Val
		hasPrev = true
		return inorder(node.Right)
	}
	return inorder(root)
}

func runTests() {
	assert(isValidBST(&TreeNode{Val: 2, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}}) == true)

	assert(isValidBST(&TreeNode{Val: 5,
		Left:  &TreeNode{Val: 1},
		Right: &TreeNode{Val: 4, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 6}},
	}) == false)

	assert(isValidBST(&TreeNode{Val: 1}) == true)
	assert(isValidBST(nil) == true)

	assert(isValidBST(&TreeNode{Val: 3,
		Left:  &TreeNode{Val: 1, Left: &TreeNode{Val: 0}, Right: &TreeNode{Val: 2}},
		Right: &TreeNode{Val: 5, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 6}},
	}) == true)

	assert(isValidBST(&TreeNode{Val: 5,
		Left:  &TreeNode{Val: 4},
		Right: &TreeNode{Val: 6, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 7}},
	}) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
