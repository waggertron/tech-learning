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

func runTests() {
	// identical trees
	p1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	q1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	assert(isSameTree(p1, q1) == true)

	// different structure
	p2 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}}
	q2 := &TreeNode{Val: 1, Right: &TreeNode{Val: 2}}
	assert(isSameTree(p2, q2) == false)

	// both nil
	assert(isSameTree(nil, nil) == true)

	// one nil
	p3 := &TreeNode{Val: 1}
	assert(isSameTree(p3, nil) == false)

	// single node same
	p4 := &TreeNode{Val: 1}
	q4 := &TreeNode{Val: 1}
	assert(isSameTree(p4, q4) == true)

	// different values
	p5 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	q5 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 4}}
	assert(isSameTree(p5, q5) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
