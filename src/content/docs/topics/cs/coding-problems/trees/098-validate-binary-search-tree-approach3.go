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
	var validate func(node *TreeNode, low, high int) bool
	validate = func(node *TreeNode, low, high int) bool {
		if node == nil {
			return true
		}
		if !(low < node.Val && node.Val < high) {
			return false
		}
		return validate(node.Left, low, node.Val) && validate(node.Right, node.Val, high)
	}
	return validate(root, -1<<62, 1<<62)
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
