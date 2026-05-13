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

// dfs returns (robThis, skipThis)
func dfs(node *TreeNode) (int, int) {
	if node == nil {
		return 0, 0
	}
	lRob, lSkip := dfs(node.Left)
	rRob, rSkip := dfs(node.Right)
	robThis := node.Val + lSkip + rSkip
	lBest := lRob
	if lSkip > lBest {
		lBest = lSkip
	}
	rBest := rRob
	if rSkip > rBest {
		rBest = rSkip
	}
	skipThis := lBest + rBest
	return robThis, skipThis
}

func rob(root *TreeNode) int {
	r, s := dfs(root)
	if r > s {
		return r
	}
	return s
}

func runTests() {
	r1 := rob(&TreeNode{Val: 3,
		Left:  &TreeNode{Val: 2, Right: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 3, Right: &TreeNode{Val: 1}},
	})
	assert(r1 == 7)

	r2 := rob(&TreeNode{Val: 3,
		Left:  &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 5, Right: &TreeNode{Val: 1}},
	})
	assert(r2 == 9)

	assert(rob(&TreeNode{Val: 5}) == 5)
	assert(rob(&TreeNode{Val: 1, Left: &TreeNode{Val: 2}}) == 2)

	fmt.Println("all tests pass")
}

func main() { runTests() }
