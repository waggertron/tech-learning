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

func sumSubarrayMins(arr []int) int {
	const MOD = 1_000_000_007
	n := len(arr)
	left := make([]int, n)
	right := make([]int, n)
	stack := []int{}

	for i := 0; i < n; i++ {
		for len(stack) > 0 && arr[stack[len(stack)-1]] >= arr[i] {
			stack = stack[:len(stack)-1]
		}
		if len(stack) > 0 {
			left[i] = i - stack[len(stack)-1]
		} else {
			left[i] = i + 1
		}
		stack = append(stack, i)
	}

	stack = []int{}
	for i := n - 1; i >= 0; i-- {
		for len(stack) > 0 && arr[stack[len(stack)-1]] > arr[i] {
			stack = stack[:len(stack)-1]
		}
		if len(stack) > 0 {
			right[i] = stack[len(stack)-1] - i
		} else {
			right[i] = n - i
		}
		stack = append(stack, i)
	}

	total := 0
	for i := 0; i < n; i++ {
		total = (total + arr[i]*left[i]*right[i]) % MOD
	}
	return total
}

func runTests() {
	assert(sumSubarrayMins([]int{3, 1, 2, 4}) == 17)
	assert(sumSubarrayMins([]int{11, 81, 94, 43, 3}) == 444)
	assert(sumSubarrayMins([]int{3}) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
