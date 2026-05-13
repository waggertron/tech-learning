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

func isBalanced(root *TreeNode) bool {
	// TODO: implement
	return false
}

func runTests() {
	// [3,9,20,null,null,15,7] -> true
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 9},
		Right: &TreeNode{Val: 20, Left: &TreeNode{Val: 15}, Right: &TreeNode{Val: 7}},
	}
	assert(isBalanced(root1) == true)

	// [1,2,2,3,3,null,null,4,4] -> false
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

	// skewed tree depth 4: not balanced
	root4 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}}}}
	assert(isBalanced(root4) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
