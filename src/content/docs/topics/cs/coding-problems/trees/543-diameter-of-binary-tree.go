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
	// TODO: implement
	return 0
}

func runTests() {
	// [1,2,3,4,5] -> 3
	root1 := &TreeNode{Val: 1,
		Left:  &TreeNode{Val: 2, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 5}},
		Right: &TreeNode{Val: 3},
	}
	assert(diameterOfBinaryTree(root1) == 3)

	// [1,2] -> 1
	root2 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}}
	assert(diameterOfBinaryTree(root2) == 1)

	// single node -> 0
	assert(diameterOfBinaryTree(&TreeNode{Val: 1}) == 0)

	// skewed tree: diameter = 3
	root4 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}}}}
	assert(diameterOfBinaryTree(root4) == 3)

	// [1,2,null,3,4] -> diameter 2 (path 3->2->4)
	root5 := &TreeNode{Val: 1,
		Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 4}},
	}
	assert(diameterOfBinaryTree(root5) == 2)

	fmt.Println("all tests pass")
}

func main() { runTests() }
