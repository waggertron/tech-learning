package main

import "fmt"

func alienOrder(words []string) string {
	inDeg := map[rune]int{}
	for _, w := range words {
		for _, c := range w {
			if _, ok := inDeg[c]; !ok {
				inDeg[c] = 0
			}
		}
	}
	graph := map[rune]map[rune]bool{}

	for i := 0; i < len(words)-1; i++ {
		w1, w2 := words[i], words[i+1]
		if len(w1) > len(w2) {
			// check prefix
			match := true
			for j := 0; j < len(w2); j++ {
				if rune(w1[j]) != rune(w2[j]) {
					match = false
					break
				}
			}
			if match {
				return ""
			}
		}
		for j := 0; j < len(w1) && j < len(w2); j++ {
			a, b := rune(w1[j]), rune(w2[j])
			if a != b {
				if graph[a] == nil {
					graph[a] = map[rune]bool{}
				}
				if !graph[a][b] {
					graph[a][b] = true
					inDeg[b]++
				}
				break
			}
		}
	}

	queue := []rune{}
	for c, d := range inDeg {
		if d == 0 {
			queue = append(queue, c)
		}
	}
	order := []rune{}
	for len(queue) > 0 {
		c := queue[0]
		queue = queue[1:]
		order = append(order, c)
		for nb := range graph[c] {
			inDeg[nb]--
			if inDeg[nb] == 0 {
				queue = append(queue, nb)
			}
		}
	}

	if len(order) != len(inDeg) {
		return ""
	}
	return string(order)
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

func containsAll(s, chars string) bool {
	for _, c := range chars {
		found := false
		for _, sc := range s {
			if sc == c {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}

func runTests() {
	r1 := alienOrder([]string{"wrt", "wrf", "er", "ett", "rftt"})
	assert(r1 == "wertf", fmt.Sprintf("got %q", r1))
	r2 := alienOrder([]string{"z", "x"})
	assert(r2 == "zx", fmt.Sprintf("got %q", r2))
	assert(alienOrder([]string{"z", "x", "z"}) == "")
	assert(alienOrder([]string{"abc", "ab"}) == "")
	r3 := alienOrder([]string{"abc"})
	assert(containsAll(r3, "abc") && len(r3) == 3, fmt.Sprintf("got %q", r3))
	fmt.Println("all tests pass")
}

func main() { runTests() }
