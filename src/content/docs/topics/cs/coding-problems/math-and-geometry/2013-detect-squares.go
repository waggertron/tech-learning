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

type DetectSquares struct {
	// TODO: implement
}

func Constructor() DetectSquares {
	return DetectSquares{}
}

func (ds *DetectSquares) Add(point []int) {
	// TODO: implement
}

func (ds *DetectSquares) Count(point []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	d := Constructor()
	d.Add([]int{3, 10})
	d.Add([]int{11, 2})
	d.Add([]int{3, 2})
	assert(d.Count([]int{11, 10}) == 1)
	assert(d.Count([]int{14, 8}) == 0)
	d.Add([]int{11, 2})
	assert(d.Count([]int{11, 10}) == 2)
	d2 := Constructor()
	assert(d2.Count([]int{0, 0}) == 0)
	d3 := Constructor()
	d3.Add([]int{0, 0})
	d3.Add([]int{2, 0})
	d3.Add([]int{0, 2})
	d3.Add([]int{2, 2})
	assert(d3.Count([]int{0, 0}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
