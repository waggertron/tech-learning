package main

import "fmt"

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

type Node struct {
	Val       int
	Neighbors []*Node
}

func cloneGraph(node *Node) *Node {
	// TODO: implement
	return nil
}

func runTests() {
	// nil input
	assert(cloneGraph(nil) == nil)

	// single node
	n1 := &Node{Val: 1}
	c1 := cloneGraph(n1)
	assert(c1 != n1)
	assert(c1.Val == 1)
	assert(len(c1.Neighbors) == 0)

	// two nodes: 1 -- 2
	a := &Node{Val: 1}
	b := &Node{Val: 2}
	a.Neighbors = []*Node{b}
	b.Neighbors = []*Node{a}
	ca := cloneGraph(a)
	assert(ca != a && ca.Val == 1)
	cb := ca.Neighbors[0]
	assert(cb != b && cb.Val == 2)
	assert(cb.Neighbors[0] == ca)

	fmt.Println("all tests pass")
}

func main() { runTests() }
