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

func minCameraCover(root *TreeNode) int {
	// TODO: implement
	return 0
}

func runTests() {
	// [0,0,null,0,0] -> 1
	assert(minCameraCover(&TreeNode{Val: 0,
		Left: &TreeNode{Val: 0,
			Left:  &TreeNode{Val: 0},
			Right: &TreeNode{Val: 0},
		},
	}) == 1)

	// [0,0,null,0,null,0,null,null,0] -> 2
	assert(minCameraCover(&TreeNode{Val: 0,
		Left: &TreeNode{Val: 0,
			Left: &TreeNode{Val: 0,
				Left: &TreeNode{Val: 0,
					Right: &TreeNode{Val: 0},
				},
			},
		},
	}) == 2)

	// single node must have camera
	assert(minCameraCover(&TreeNode{Val: 0}) == 1)

	// two nodes: one camera suffices
	assert(minCameraCover(&TreeNode{Val: 0, Left: &TreeNode{Val: 0}}) == 1)

	fmt.Println("all tests pass")
}

func main() { runTests() }
