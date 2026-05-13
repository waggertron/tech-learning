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

func levelOrder(root *TreeNode) [][]int {
	// TODO: implement
	return nil
}

func slices2Equal(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func runTests() {
	// [3,9,20,null,null,15,7] -> [[3],[9,20],[15,7]]
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 9},
		Right: &TreeNode{Val: 20, Left: &TreeNode{Val: 15}, Right: &TreeNode{Val: 7}},
	}
	assert(slices2Equal(levelOrder(root1), [][]int{{3}, {9, 20}, {15, 7}}))

	// [1] -> [[1]]
	assert(slices2Equal(levelOrder(&TreeNode{Val: 1}), [][]int{{1}}))

	// nil -> []
	assert(len(levelOrder(nil)) == 0)

	// skewed left
	root4 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	assert(slices2Equal(levelOrder(root4), [][]int{{1}, {2}, {3}}))

	fmt.Println("all tests pass")
}

func main() { runTests() }
