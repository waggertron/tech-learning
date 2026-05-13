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

func maxPathSum(root *TreeNode) int {
	// TODO: implement
	return 0
}

func runTests() {
	// [1,2,3] -> 6
	assert(maxPathSum(&TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}) == 6)

	// [-10,9,20,null,null,15,7] -> 42
	assert(maxPathSum(&TreeNode{Val: -10,
		Left:  &TreeNode{Val: 9},
		Right: &TreeNode{Val: 20, Left: &TreeNode{Val: 15}, Right: &TreeNode{Val: 7}},
	}) == 42)

	// single node
	assert(maxPathSum(&TreeNode{Val: 1}) == 1)

	// all negative: pick least negative
	assert(maxPathSum(&TreeNode{Val: -3, Left: &TreeNode{Val: -1}, Right: &TreeNode{Val: -2}}) == -1)

	// negative root, positive children
	assert(maxPathSum(&TreeNode{Val: -1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}) == 4)

	fmt.Println("all tests pass")
}

func main() { runTests() }
