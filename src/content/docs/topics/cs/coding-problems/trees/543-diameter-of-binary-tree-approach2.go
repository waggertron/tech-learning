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

func diameterOfBinaryTree(root *TreeNode) int {
	best := 0

	var heightFn func(node *TreeNode) int
	heightFn = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		left := heightFn(node.Left)
		right := heightFn(node.Right)
		if left+right > best {
			best = left + right
		}
		if left > right {
			return 1 + left
		}
		return 1 + right
	}

	heightFn(root)
	return best
}

func runTests() {
	root1 := &TreeNode{Val: 1,
		Left:  &TreeNode{Val: 2, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 5}},
		Right: &TreeNode{Val: 3},
	}
	assert(diameterOfBinaryTree(root1) == 3)

	root2 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}}
	assert(diameterOfBinaryTree(root2) == 1)

	assert(diameterOfBinaryTree(&TreeNode{Val: 1}) == 0)

	root4 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}}}}
	assert(diameterOfBinaryTree(root4) == 3)

	root5 := &TreeNode{Val: 1,
		Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 4}},
	}
	assert(diameterOfBinaryTree(root5) == 2)

	fmt.Println("all tests pass")
}

func main() { runTests() }
