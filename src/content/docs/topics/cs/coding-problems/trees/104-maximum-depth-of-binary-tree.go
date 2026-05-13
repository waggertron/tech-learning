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

func maxDepth(root *TreeNode) int {
	// TODO: implement
	return 0
}

func runTests() {
	// [3,9,20,null,null,15,7] -> depth 3
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 9},
		Right: &TreeNode{Val: 20, Left: &TreeNode{Val: 15}, Right: &TreeNode{Val: 7}},
	}
	assert(maxDepth(root1) == 3)

	// [1,null,2] -> depth 2
	root2 := &TreeNode{Val: 1, Right: &TreeNode{Val: 2}}
	assert(maxDepth(root2) == 2)

	assert(maxDepth(nil) == 0)

	root3 := &TreeNode{Val: 1}
	assert(maxDepth(root3) == 1)

	// skewed tree depth 4
	root4 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}}}}
	assert(maxDepth(root4) == 4)

	fmt.Println("all tests pass")
}

func main() { runTests() }
