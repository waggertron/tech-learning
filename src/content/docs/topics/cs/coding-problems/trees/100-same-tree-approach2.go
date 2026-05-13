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

type pair struct{ a, b *TreeNode }

func isSameTree(p *TreeNode, q *TreeNode) bool {
	queue := []pair{{p, q}}
	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]
		a, b := curr.a, curr.b
		if a == nil && b == nil {
			continue
		}
		if a == nil || b == nil || a.Val != b.Val {
			return false
		}
		queue = append(queue, pair{a.Left, b.Left})
		queue = append(queue, pair{a.Right, b.Right})
	}
	return true
}

func runTests() {
	p1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	q1 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	assert(isSameTree(p1, q1) == true)

	p2 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}}
	q2 := &TreeNode{Val: 1, Right: &TreeNode{Val: 2}}
	assert(isSameTree(p2, q2) == false)

	assert(isSameTree(nil, nil) == true)

	p3 := &TreeNode{Val: 1}
	assert(isSameTree(p3, nil) == false)

	p5 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
	q5 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 4}}
	assert(isSameTree(p5, q5) == false)

	fmt.Println("all tests pass")
}

func main() { runTests() }
