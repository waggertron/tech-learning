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

func isSameTree(p *TreeNode, q *TreeNode) bool {
	// TODO: implement
	return false
}

func isSubtree(root *TreeNode, subRoot *TreeNode) bool {
	// TODO: implement
	return false
}

func runTests() {
	// [3,4,5,1,2], subRoot=[4,1,2] -> true
	root1 := &TreeNode{Val: 3,
		Left: &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 2}},
		Right: &TreeNode{Val: 5},
	}
	sub1 := &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 2}}
	assert(isSubtree(root1, sub1) == true)

	// [3,4,5,1,2,null,null,null,null,0], subRoot=[4,1,2] -> false
	root2 := &TreeNode{Val: 3,
		Left: &TreeNode{Val: 4,
			Left:  &TreeNode{Val: 1},
			Right: &TreeNode{Val: 2, Left: &TreeNode{Val: 0}},
		},
		Right: &TreeNode{Val: 5},
	}
	sub2 := &TreeNode{Val: 4, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 2}}
	assert(isSubtree(root2, sub2) == false)

	// subRoot is the whole tree
	t := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	sub3 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	assert(isSubtree(t, sub3) == true)

	// single node subroot found
	root3 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	assert(isSubtree(root3, &TreeNode{Val: 2}) == true)

	// single node subroot not found
	assert(isSubtree(root3, &TreeNode{Val: 4}) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
