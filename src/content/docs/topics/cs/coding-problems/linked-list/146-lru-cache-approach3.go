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

type lruNode struct {
	key, val   int
	prev, next *lruNode
}

type LRUCache struct {
	cap        int
	cache      map[int]*lruNode
	head, tail *lruNode
}

func Constructor(capacity int) LRUCache {
	head := &lruNode{}
	tail := &lruNode{}
	head.next = tail
	tail.prev = head
	return LRUCache{
		cap:   capacity,
		cache: make(map[int]*lruNode),
		head:  head,
		tail:  tail,
	}
}

func (c *LRUCache) remove(node *lruNode) {
	node.prev.next = node.next
	node.next.prev = node.prev
}

func (c *LRUCache) addToFront(node *lruNode) {
	node.prev = c.head
	node.next = c.head.next
	c.head.next.prev = node
	c.head.next = node
}

func (c *LRUCache) Get(key int) int {
	node, ok := c.cache[key]
	if !ok {
		return -1
	}
	c.remove(node)
	c.addToFront(node)
	return node.val
}

func (c *LRUCache) Put(key int, value int) {
	if node, ok := c.cache[key]; ok {
		node.val = value
		c.remove(node)
		c.addToFront(node)
		return
	}
	if len(c.cache) >= c.cap {
		lru := c.tail.prev
		c.remove(lru)
		delete(c.cache, lru.key)
	}
	node := &lruNode{key: key, val: value}
	c.cache[key] = node
	c.addToFront(node)
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
