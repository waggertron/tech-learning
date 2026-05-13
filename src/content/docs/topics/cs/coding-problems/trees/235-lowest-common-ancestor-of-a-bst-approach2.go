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

func lowestCommonAncestor(root *TreeNode, p *TreeNode, q *TreeNode) *TreeNode {
	for root != nil {
		if p.Val < root.Val && q.Val < root.Val {
			root = root.Left
		} else if p.Val > root.Val && q.Val > root.Val {
			root = root.Right
		} else {
			return root
		}
	}
	return nil
}

func findNode(root *TreeNode, val int) *TreeNode {
	for root != nil {
		if val == root.Val {
			return root
		} else if val < root.Val {
			root = root.Left
		} else {
			root = root.Right
		}
	}
	return nil
}

func runTests() {
	t := &TreeNode{Val: 6,
		Left: &TreeNode{Val: 2,
			Left:  &TreeNode{Val: 0},
			Right: &TreeNode{Val: 4, Left: &TreeNode{Val: 3}, Right: &TreeNode{Val: 5}},
		},
		Right: &TreeNode{Val: 8,
			Left:  &TreeNode{Val: 7},
			Right: &TreeNode{Val: 9},
		},
	}
	assert(lowestCommonAncestor(t, findNode(t, 2), findNode(t, 8)).Val == 6)
	assert(lowestCommonAncestor(t, findNode(t, 2), findNode(t, 4)).Val == 2)
	assert(lowestCommonAncestor(t, findNode(t, 0), findNode(t, 5)).Val == 2)

	t2 := &TreeNode{Val: 4,
		Left:  &TreeNode{Val: 2, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}},
		Right: &TreeNode{Val: 6, Left: &TreeNode{Val: 5}, Right: &TreeNode{Val: 7}},
	}
	assert(lowestCommonAncestor(t2, findNode(t2, 5), findNode(t2, 7)).Val == 6)

	fmt.Println("all tests pass")
}

func main() { runTests() }
