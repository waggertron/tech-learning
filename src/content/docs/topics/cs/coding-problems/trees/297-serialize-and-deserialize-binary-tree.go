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

type Codec struct{}

func (c *Codec) serialize(root *TreeNode) string {
	// TODO: implement
	return ""
}

func (c *Codec) deserialize(data string) *TreeNode {
	// TODO: implement
	return nil
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

	// [1,2,3,null,null,4,5]
	t := &TreeNode{Val: 1,
		Left:  &TreeNode{Val: 2},
		Right: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 5}},
	}
	assert(slicesEqual(treeToSlice(codec.deserialize(codec.serialize(t))), []int{1, 2, 3, 4, 5}))

	// empty tree
	nilResult := codec.deserialize(codec.serialize(nil))
	assert(nilResult == nil)

	// single node
	t2 := &TreeNode{Val: 42}
	t2Back := codec.deserialize(codec.serialize(t2))
	assert(t2Back != nil)
	assert(t2Back.Val == 42)

	// left-skewed [1,2,null,3]
	t3 := &TreeNode{Val: 1, Left: &TreeNode{Val: 2, Left: &TreeNode{Val: 3}}}
	assert(slicesEqual(treeToSlice(codec.deserialize(codec.serialize(t3))), []int{1, 2, 3}))

	fmt.Println("all tests pass")
}

func main() { runTests() }
