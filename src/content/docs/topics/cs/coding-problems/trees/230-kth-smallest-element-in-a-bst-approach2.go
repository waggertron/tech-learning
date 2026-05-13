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

func kthSmallest(root *TreeNode, k int) int {
	count := 0
	result := -1
	var inorder func(node *TreeNode)
	inorder = func(node *TreeNode) {
		if node == nil || result != -1 {
			return
		}
		inorder(node.Left)
		count++
		if count == k {
			result = node.Val
			return
		}
		inorder(node.Right)
	}
	inorder(root)
	return result
}

func runTests() {
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 1, Right: &TreeNode{Val: 2}},
		Right: &TreeNode{Val: 4},
	}
	assert(kthSmallest(root1, 1) == 1)

	root2 := &TreeNode{Val: 5,
		Left: &TreeNode{Val: 3,
			Left:  &TreeNode{Val: 2, Left: &TreeNode{Val: 1}},
			Right: &TreeNode{Val: 4},
		},
		Right: &TreeNode{Val: 6},
	}
	assert(kthSmallest(root2, 3) == 3)

	assert(kthSmallest(&TreeNode{Val: 1}, 1) == 1)

	assert(kthSmallest(root1, 4) == 4)

	fmt.Println("all tests pass")
}

func main() { runTests() }
