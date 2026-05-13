package main

import (
	"fmt"
	"math"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func maxProbability(n int, edges [][]int, succProb []float64, start int, end int) float64 {
	// TODO: implement
	return 0.0
}

func runTests() {
	assert(math.Abs(maxProbability(3, [][]int{{0, 1}, {1, 2}, {0, 2}}, []float64{0.5, 0.5, 0.2}, 0, 2)-0.25) < 1e-5)
	assert(math.Abs(maxProbability(3, [][]int{{0, 1}, {1, 2}, {0, 2}}, []float64{0.5, 0.5, 0.3}, 0, 2)-0.3) < 1e-5)
	assert(maxProbability(3, [][]int{{0, 1}}, []float64{0.5}, 0, 2) == 0.0)
	assert(math.Abs(maxProbability(2, [][]int{{0, 1}}, []float64{0.9}, 0, 1)-0.9) < 1e-5)
	assert(math.Abs(maxProbability(3, [][]int{{0, 1}, {1, 2}}, []float64{0.5, 0.5}, 1, 1)-1.0) < 1e-5)
	fmt.Println("all tests pass")
}

func main() { runTests() }
