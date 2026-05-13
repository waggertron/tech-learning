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

func buildTree(preorder []int, inorder []int) *TreeNode {
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
	// preorder=[3,9,20,15,7], inorder=[9,3,15,20,7] -> [3,9,20,15,7] in BFS order
	t := buildTree([]int{3, 9, 20, 15, 7}, []int{9, 3, 15, 20, 7})
	assert(t != nil)
	assert(t.Val == 3)
	assert(t.Left.Val == 9)
	assert(t.Right.Val == 20)
	assert(t.Right.Left.Val == 15)
	assert(t.Right.Right.Val == 7)

	// single node
	t2 := buildTree([]int{-1}, []int{-1})
	assert(t2 != nil)
	assert(t2.Val == -1)
	assert(t2.Left == nil && t2.Right == nil)

	// left-skewed: preorder=[1,2,3], inorder=[3,2,1]
	t3 := buildTree([]int{1, 2, 3}, []int{3, 2, 1})
	assert(t3.Val == 1)
	assert(t3.Left.Val == 2)
	assert(t3.Left.Left.Val == 3)

	// right-skewed: preorder=[1,2,3], inorder=[1,2,3]
	t4 := buildTree([]int{1, 2, 3}, []int{1, 2, 3})
	assert(t4.Val == 1)
	assert(t4.Right.Val == 2)
	assert(t4.Right.Right.Val == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
