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

func rob(root *TreeNode) int {
	// TODO: implement
	return 0
}

func runTests() {
	// [3,2,3,null,3,null,1] -> 7
	assert(rob(&TreeNode{Val: 3,
		Left:  &TreeNode{Val: 2, Right: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 3, Right: &TreeNode{Val: 1}},
	}) == 7)

	// [3,4,5,1,3,null,1] -> 9
	assert(rob(&TreeNode{Val: 3,
		Left:  &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 5, Right: &TreeNode{Val: 1}},
	}) == 9)

	// single node
	assert(rob(&TreeNode{Val: 5}) == 5)

	// two nodes: rob the larger
	assert(rob(&TreeNode{Val: 1, Left: &TreeNode{Val: 2}}) == 2)

	fmt.Println("all tests pass")
}

func main() { runTests() }
