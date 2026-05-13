package main

import (
	"fmt"
	"strconv"
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

type Codec struct{}

func (c *Codec) serialize(root *TreeNode) string {
	parts := []string{}
	var rec func(node *TreeNode)
	rec = func(node *TreeNode) {
		if node == nil {
			parts = append(parts, "#")
			return
		}
		parts = append(parts, strconv.Itoa(node.Val))
		rec(node.Left)
		rec(node.Right)
	}
	rec(root)
	return strings.Join(parts, ",")
}

func (c *Codec) deserialize(data string) *TreeNode {
	tokens := strings.Split(data, ",")
	i := 0
	var rec func() *TreeNode
	rec = func() *TreeNode {
		if i >= len(tokens) || tokens[i] == "#" {
			i++
			return nil
		}
		val, _ := strconv.Atoi(tokens[i])
		i++
		node := &TreeNode{Val: val}
		node.Left = rec()
		node.Right = rec()
		return node
	}
	return rec()
}

func treeToSlice(root *TreeNode) []int {
	if root == nil {
		return []int{}
	}
	result := []int{}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		result = append(result, node.Val)
		if node.Left != nil {
			queue = append(queue, node.Left)
		}
		if node.Right != nil {
			queue = append(queue, node.Right)
		}
	}
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
	codec := &Codec{}

	t := &TreeNode{Val: 1,
		Left:  &TreeNode{Val: 2},
		Right: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 5}},
	}
	assert(slicesEqual(treeToSlice(codec.deserialize(codec.serialize(t))), []int{1, 2, 3, 4, 5}))

	// empty tree: serialize produces "#", deserialize of "#" must return nil
	serializedNil := codec.serialize(nil)
	assert(codec.deserialize(serializedNil) == nil)

	t2 := &TreeNode{Val: 42}
	assert(codec.deserialize(codec.serialize(t2)).Val == 42)

	t3 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	assert(slicesEqual(treeToSlice(codec.deserialize(codec.serialize(t3))), []int{1, 2, 3}))

	fmt.Println("all tests pass")
}

func main() { runTests() }
