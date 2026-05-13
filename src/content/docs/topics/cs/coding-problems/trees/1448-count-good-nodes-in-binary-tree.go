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

func goodNodes(root *TreeNode) int {
	// TODO: implement
	return 0
}

func runTests() {
	// [3,1,4,3,null,1,5] -> 4
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 1, Left: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 5}},
	}
	assert(goodNodes(root1) == 4)

	// [3,3,null,4,2] -> 3
	root2 := &TreeNode{Val: 3,
		Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 2}},
	}
	assert(goodNodes(root2) == 3)

	// single node -> 1
	assert(goodNodes(&TreeNode{Val: 1}) == 1)

	// [5,4,6,3,null,null,7] -> 3 (5, 6, 7 are good)
	root4 := &TreeNode{Val: 5,
		Left:  &TreeNode{Val: 4, Left: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 6, Right: &TreeNode{Val: 7}},
	}
	assert(goodNodes(root4) == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
