package main

import "fmt"

type Node struct {
	Val       int
	Neighbors []*Node
}

func cloneGraph(node *Node) *Node {
	if node == nil {
		return nil
	}
	oldToNew := map[*Node]*Node{node: {Val: node.Val}}
	queue := []*Node{node}
	for len(queue) > 0 {
		cur := queue[0]
		queue = queue[1:]
		for _, nb := range cur.Neighbors {
			if _, ok := oldToNew[nb]; !ok {
				oldToNew[nb] = &Node{Val: nb.Val}
				queue = append(queue, nb)
			}
			oldToNew[cur].Neighbors = append(oldToNew[cur].Neighbors, oldToNew[nb])
		}
	}
	return oldToNew[node]
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

func runTests() {
	assert(cloneGraph(nil) == nil)

	n1 := &Node{Val: 1}
	c1 := cloneGraph(n1)
	assert(c1 != n1 && c1.Val == 1 && len(c1.Neighbors) == 0)

	a := &Node{Val: 1}
	b := &Node{Val: 2}
	a.Neighbors = []*Node{b}
	b.Neighbors = []*Node{a}
	ca := cloneGraph(a)
	assert(ca != a && ca.Val == 1)
	cb := ca.Neighbors[0]
	assert(cb != b && cb.Val == 2 && cb.Neighbors[0] == ca)

	fmt.Println("all tests pass")
}

func main() { runTests() }
