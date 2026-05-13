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
	result := []int{}
	var dfs func(node *TreeNode, depth int)
	dfs = func(node *TreeNode, depth int) {
		if node == nil {
			return
		}
		if depth == len(result) {
			result = append(result, node.Val)
		}
		dfs(node.Right, depth+1)
		dfs(node.Left, depth+1)
	}
	dfs(root, 0)
	return result
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
	root1 := &TreeNode{Val: 1,
		Left:  &TreeNode{Val: 2, Right: &TreeNode{Val: 5}},
		Right: &TreeNode{Val: 3, Right: &TreeNode{Val: 4}},
	}
	assert(slicesEqual(rightSideView(root1), []int{1, 3, 4}))

	root2 := &TreeNode{Val: 1, Right: &TreeNode{Val: 3}}
	assert(slicesEqual(rightSideView(root2), []int{1, 3}))

	assert(len(rightSideView(nil)) == 0)

	assert(slicesEqual(rightSideView(&TreeNode{Val: 1}), []int{1}))

	root5 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	assert(slicesEqual(rightSideView(root5), []int{1, 2, 3}))

	fmt.Println("all tests pass")
}

func main() { runTests() }
