package main

import (
	"fmt"
	"strings"
)

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

func serialize(node *TreeNode) string {
	if node == nil {
		return "#"
	}
	return fmt.Sprintf(",%d,(%s)(%s)", node.Val, serialize(node.Left), serialize(node.Right))
}

func isSubtree(root *TreeNode, subRoot *TreeNode) bool {
	return strings.Contains(serialize(root), serialize(subRoot))
}

func runTests() {
	root1 := &TreeNode{Val: 3,
		Left:  &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 2}},
		Right: &TreeNode{Val: 5},
	}
	sub1 := &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 2}}
	assert(isSubtree(root1, sub1) == true)

	root2 := &TreeNode{Val: 3,
		Left: &TreeNode{Val: 4,
			Left:  &TreeNode{Val: 1},
			Right: &TreeNode{Val: 2, Left: &TreeNode{Val: 0}},
		},
		Right: &TreeNode{Val: 5},
	}
	sub2 := &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 2}}
	assert(isSubtree(root2, sub2) == false)

	root3 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	assert(isSubtree(root3, &TreeNode{Val: 2}) == true)
	assert(isSubtree(root3, &TreeNode{Val: 4}) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
