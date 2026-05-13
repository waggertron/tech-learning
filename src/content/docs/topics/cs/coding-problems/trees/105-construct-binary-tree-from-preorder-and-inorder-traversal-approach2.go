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
	inorderIdx := make(map[int]int, len(inorder))
	for i, v := range inorder {
		inorderIdx[v] = i
	}
	preI := 0

	var rec func(inL, inR int) *TreeNode
	rec = func(inL, inR int) *TreeNode {
		if inL > inR {
			return nil
		}
		rootVal := preorder[preI]
		preI++
		root := &TreeNode{Val: rootVal}
		mid := inorderIdx[rootVal]
		root.Left = rec(inL, mid-1)
		root.Right = rec(mid+1, inR)
		return root
	}

	return rec(0, len(inorder)-1)
}

func runTests() {
	t := buildTree([]int{3, 9, 20, 15, 7}, []int{9, 3, 15, 20, 7})
	assert(t != nil)
	assert(t.Val == 3)
	assert(t.Left.Val == 9)
	assert(t.Right.Val == 20)
	assert(t.Right.Left.Val == 15)
	assert(t.Right.Right.Val == 7)

	t2 := buildTree([]int{-1}, []int{-1})
	assert(t2 != nil && t2.Val == -1 && t2.Left == nil && t2.Right == nil)

	t3 := buildTree([]int{1, 2, 3}, []int{3, 2, 1})
	assert(t3.Val == 1 && t3.Left.Val == 2 && t3.Left.Left.Val == 3)

	t4 := buildTree([]int{1, 2, 3}, []int{1, 2, 3})
	assert(t4.Val == 1 && t4.Right.Val == 2 && t4.Right.Right.Val == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
