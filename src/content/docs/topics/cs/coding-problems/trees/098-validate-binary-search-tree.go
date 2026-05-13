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

func isValidBST(root *TreeNode) bool {
	// TODO: implement
	return false
}

func runTests() {
	// [2,1,3] -> true
	assert(isValidBST(&TreeNode{Val: 2, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}}) == true)

	// [5,1,4,null,null,3,6] -> false
	assert(isValidBST(&TreeNode{Val: 5,
		Left:  &TreeNode{Val: 1},
		Right: &TreeNode{Val: 4, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 6}},
	}) == false)

	assert(isValidBST(&TreeNode{Val: 1}) == true)
	assert(isValidBST(nil) == true)

	// [3,1,5,0,2,4,6] -> true
	assert(isValidBST(&TreeNode{Val: 3,
		Left:  &TreeNode{Val: 1, Left: &TreeNode{Val: 0}, Right: &TreeNode{Val: 2}},
		Right: &TreeNode{Val: 5, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 6}},
	}) == true)

	// [5,4,6,null,null,3,7] -> false (3 in right subtree < root 5)
	assert(isValidBST(&TreeNode{Val: 5,
		Left:  &TreeNode{Val: 4},
		Right: &TreeNode{Val: 6, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 7}},
	}) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
