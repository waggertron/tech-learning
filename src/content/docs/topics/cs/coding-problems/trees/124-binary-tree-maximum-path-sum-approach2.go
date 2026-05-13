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
	best := -1 << 62

	var maxGain func(node *TreeNode) int
	maxGain = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		left := maxGain(node.Left)
		if left < 0 {
			left = 0
		}
		right := maxGain(node.Right)
		if right < 0 {
			right = 0
		}
		candidate := node.Val + left + right
		if candidate > best {
			best = candidate
		}
		if left > right {
			return node.Val + left
		}
		return node.Val + right
	}

	maxGain(root)
	return best
}

func runTests() {
	assert(maxPathSum(&TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}) == 6)

	assert(maxPathSum(&TreeNode{Val: -10,
		Left:  &TreeNode{Val: 9},
		Right: &TreeNode{Val: 20, Left: &TreeNode{Val: 15}, Right: &TreeNode{Val: 7}},
	}) == 42)

	assert(maxPathSum(&TreeNode{Val: 1}) == 1)
	assert(maxPathSum(&TreeNode{Val: -3, Left: &TreeNode{Val: -1}, Right: &TreeNode{Val: -2}}) == -1)
	assert(maxPathSum(&TreeNode{Val: -1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}) == 4)

	fmt.Println("all tests pass")
}

func main() { runTests() }
