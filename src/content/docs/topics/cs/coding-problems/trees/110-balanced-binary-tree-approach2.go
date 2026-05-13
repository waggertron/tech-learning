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

func height(node *TreeNode) int {
	if node == nil {
		return 0
	}
	lh := height(node.Left)
	if lh == -1 {
		return -1
	}
	rh := height(node.Right)
	if rh == -1 {
		return -1
	}
	diff := lh - rh
	if diff > 1 || diff < -1 {
		return -1
	}
	if lh > rh {
		return 1 + lh
	}
	return 1 + rh
}

func isBalanced(root *TreeNode) bool {
	return height(root) != -1
}

func runTests() {
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 9},
		Right: &TreeNode{Val: 20, Left: &TreeNode{Val: 15}, Right: &TreeNode{Val: 7}},
	}
	assert(isBalanced(root1) == true)

	root2 := &TreeNode{Val: 1,
		Left: &TreeNode{Val: 2,
			Left: &TreeNode{Val: 3,
				Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 4},
			},
			Right: &TreeNode{Val: 3},
		},
		Right: &TreeNode{Val: 2},
	}
	assert(isBalanced(root2) == false)

	assert(isBalanced(nil) == true)
	assert(isBalanced(&TreeNode{Val: 1}) == true)

	root4 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}}}}
	assert(isBalanced(root4) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
