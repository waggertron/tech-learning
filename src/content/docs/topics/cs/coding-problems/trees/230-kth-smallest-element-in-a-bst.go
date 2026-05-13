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
	// TODO: implement
	return 0
}

func runTests() {
	// [3,1,4,null,2], k=1 -> 1
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 1, Right: &TreeNode{Val: 2}},
		Right: &TreeNode{Val: 4},
	}
	assert(kthSmallest(root1, 1) == 1)

	// [5,3,6,2,4,null,null,1], k=3 -> 3
	root2 := &TreeNode{Val: 5,
		Left: &TreeNode{Val: 3,
			Left:  &TreeNode{Val: 2, Left: &TreeNode{Val: 1}},
			Right: &TreeNode{Val: 4},
		},
		Right: &TreeNode{Val: 6},
	}
	assert(kthSmallest(root2, 3) == 3)

	// single node, k=1
	assert(kthSmallest(&TreeNode{Val: 1}, 1) == 1)

	// k=n (largest): [3,1,4,null,2] sorted=[1,2,3,4], k=4 -> 4
	assert(kthSmallest(root1, 4) == 4)

	fmt.Println("all tests pass")
}

func main() { runTests() }
