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
	var dfs func(node *TreeNode, maxSoFar int) int
	dfs = func(node *TreeNode, maxSoFar int) int {
		if node == nil {
			return 0
		}
		good := 0
		if node.Val >= maxSoFar {
			good = 1
		}
		newMax := maxSoFar
		if node.Val > newMax {
			newMax = node.Val
		}
		return good + dfs(node.Left, newMax) + dfs(node.Right, newMax)
	}
	return dfs(root, -1<<31)
}

func runTests() {
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 1, Left: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 5}},
	}
	assert(goodNodes(root1) == 4)

	root2 := &TreeNode{Val: 3,
		Left: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 2}},
	}
	assert(goodNodes(root2) == 3)

	assert(goodNodes(&TreeNode{Val: 1}) == 1)

	root4 := &TreeNode{Val: 5,
		Left:  &TreeNode{Val: 4, Left: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 6, Right: &TreeNode{Val: 7}},
	}
	assert(goodNodes(root4) == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
