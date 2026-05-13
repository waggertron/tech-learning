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
	cameras := 0

	// returns: 0=not covered, 1=has camera, 2=covered (no camera)
	var dfsFn func(node *TreeNode) int
	dfsFn = func(node *TreeNode) int {
		if node == nil {
			return 2
		}
		left := dfsFn(node.Left)
		right := dfsFn(node.Right)
		if left == 0 || right == 0 {
			cameras++
			return 1
		}
		if left == 1 || right == 1 {
			return 2
		}
		return 0
	}

	if dfsFn(root) == 0 {
		cameras++
	}
	return cameras
}

func runTests() {
	assert(minCameraCover(&TreeNode{Val: 0,
		Left: &TreeNode{Val: 0,
			Left:  &TreeNode{Val: 0},
			Right: &TreeNode{Val: 0},
		},
	}) == 1)

	assert(minCameraCover(&TreeNode{Val: 0,
		Left: &TreeNode{Val: 0,
			Left: &TreeNode{Val: 0,
				Left: &TreeNode{Val: 0,
					Right: &TreeNode{Val: 0},
				},
			},
		},
	}) == 2)

	assert(minCameraCover(&TreeNode{Val: 0}) == 1)
	assert(minCameraCover(&TreeNode{Val: 0, Left: &TreeNode{Val: 0}}) == 1)

	fmt.Println("all tests pass")
}

func main() { runTests() }
