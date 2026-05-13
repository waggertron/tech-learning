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

func rightSideView(root *TreeNode) []int {
	// TODO: implement
	return nil
}

func slicesEqual(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func runTests() {
	// [1,2,3,null,5,null,4] -> [1,3,4]
	root1 := &TreeNode{Val: 1,
		Left:  &TreeNode{Val: 2, Right: &TreeNode{Val: 5}},
		Right: &TreeNode{Val: 3, Right: &TreeNode{Val: 4}},
	}
	assert(slicesEqual(rightSideView(root1), []int{1, 3, 4}))

	// [1,null,3] -> [1,3]
	root2 := &TreeNode{Val: 1, Right: &TreeNode{Val: 3}}
	assert(slicesEqual(rightSideView(root2), []int{1, 3}))

	// nil -> []
	assert(len(rightSideView(nil)) == 0)

	// single node -> [1]
	assert(slicesEqual(rightSideView(&TreeNode{Val: 1}), []int{1}))

	// left-only skewed -> each level has only one node
	root5 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	assert(slicesEqual(rightSideView(root5), []int{1, 2, 3}))

	fmt.Println("all tests pass")
}

func main() { runTests() }
