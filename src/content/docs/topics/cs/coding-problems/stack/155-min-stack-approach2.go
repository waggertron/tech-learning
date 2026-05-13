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

type MinStack struct {
	stack []int
	mins  []int
}

func Constructor() MinStack {
	return MinStack{}
}

func (ms *MinStack) Push(val int) {
	ms.stack = append(ms.stack, val)
	if len(ms.mins) == 0 || val < ms.mins[len(ms.mins)-1] {
		ms.mins = append(ms.mins, val)
	} else {
		ms.mins = append(ms.mins, ms.mins[len(ms.mins)-1])
	}
}

func (ms *MinStack) Pop() {
	ms.stack = ms.stack[:len(ms.stack)-1]
	ms.mins = ms.mins[:len(ms.mins)-1]
}

func (ms *MinStack) Top() int {
	return ms.stack[len(ms.stack)-1]
}

func (ms *MinStack) GetMin() int {
	return ms.mins[len(ms.mins)-1]
}

func runTests() {
	ms := Constructor()
	ms.Push(-2)
	ms.Push(0)
	ms.Push(-3)
	assert(ms.GetMin() == -3)
	ms.Pop()
	assert(ms.Top() == 0)
	assert(ms.GetMin() == -2)

	ms2 := Constructor()
	ms2.Push(1)
	ms2.Push(2)
	ms2.Push(3)
	assert(ms2.GetMin() == 1)
	ms2.Pop()
	assert(ms2.GetMin() == 1)

	ms3 := Constructor()
	ms3.Push(5)
	assert(ms3.Top() == 5)
	assert(ms3.GetMin() == 5)
	fmt.Println("all tests pass")
}

func main() { runTests() }
