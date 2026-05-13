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

type LRUCache struct {
	// TODO: implement
}

func Constructor(capacity int) LRUCache {
	// TODO: implement
	return LRUCache{}
}

func (c *LRUCache) Get(key int) int {
	// TODO: implement
	return -1
}

func (c *LRUCache) Put(key int, value int) {
	// TODO: implement
}

func runTests() {
	cache := Constructor(2)
	cache.Put(1, 1)
	cache.Put(2, 2)
	assert(cache.Get(1) == 1)
	cache.Put(3, 3)
	assert(cache.Get(2) == -1)
	cache.Put(4, 4)
	assert(cache.Get(1) == -1)
	assert(cache.Get(3) == 3)
	assert(cache.Get(4) == 4)

	c1 := Constructor(1)
	c1.Put(1, 10)
	assert(c1.Get(1) == 10)
	c1.Put(2, 20)
	assert(c1.Get(1) == -1)
	assert(c1.Get(2) == 20)

	c2 := Constructor(2)
	c2.Put(1, 1)
	c2.Put(2, 2)
	c2.Put(1, 100)
	c2.Put(3, 3)
	assert(c2.Get(1) == 100)
	assert(c2.Get(2) == -1)
	assert(c2.Get(3) == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
