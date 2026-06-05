// Minimal Kademlia DHT implementation (in-memory simulation).
//
// K     = bucket size (20 in production, 3 here for clarity)
// BITS  = ID space width (160 in production, 8 here for clarity)
// ALPHA = lookup concurrency (3 in production)
package main

import (
	"fmt"
	"math/bits"
	"sort"
)

const K = 3
const BITS = 8
const ALPHA = 3

func xorDist(a, b int) int { return a ^ b }

func bucketIndex(ownID, otherID int) int {
	d := xorDist(ownID, otherID)
	if d == 0 {
		return 0
	}
	return bits.Len(uint(d)) - 1
}

// RoutingTable holds BITS k-buckets indexed by XOR distance prefix.
type RoutingTable struct {
	owner   int
	buckets [BITS][]int
}

func (rt *RoutingTable) Add(nodeID int) {
	if nodeID == rt.owner {
		return
	}
	b := bucketIndex(rt.owner, nodeID)
	bucket := rt.buckets[b]
	for i, nid := range bucket {
		if nid == nodeID {
			// Move to tail = most recently seen
			rt.buckets[b] = append(append(bucket[:i:i], bucket[i+1:]...), nodeID)
			return
		}
	}
	if len(bucket) < K {
		rt.buckets[b] = append(bucket, nodeID)
	}
}

func (rt *RoutingTable) Closest(target, n int) []int {
	var all []int
	for _, b := range rt.buckets {
		all = append(all, b...)
	}
	sort.Slice(all, func(i, j int) bool {
		return xorDist(all[i], target) < xorDist(all[j], target)
	})
	if n < len(all) {
		return all[:n]
	}
	return all
}

// Node is a Kademlia participant in the simulated network.
type Node struct {
	id    int
	net   *Network
	table RoutingTable
	store map[int]string
}

func NewNode(id int, net *Network) *Node {
	n := &Node{id: id, net: net, store: make(map[int]string)}
	n.table.owner = id
	return n
}

// RPCFindNode returns K closest nodes to target from this node's routing table.
func (n *Node) RPCFindNode(target int) []int {
	return n.table.Closest(target, K)
}

// RPCFindValue returns (value, true) if the key is stored, else ("", false) and K closest nodes.
func (n *Node) RPCFindValue(key int) (string, bool, []int) {
	if v, ok := n.store[key]; ok {
		return v, true, nil
	}
	return "", false, n.table.Closest(key, K)
}

// RPCStore stores a key-value pair locally.
func (n *Node) RPCStore(key int, value string) {
	n.store[key] = value
}

// Lookup performs an iterative FIND_NODE and returns K closest nodes in the network.
func (n *Node) Lookup(target int) []int {
	seen := map[int]bool{n.id: true}
	shortlist := n.table.Closest(target, ALPHA)

	for {
		var newNodes []int
		for _, nid := range shortlist {
			if seen[nid] {
				continue
			}
			seen[nid] = true
			if remote, ok := n.net.nodes[nid]; ok {
				returned := remote.RPCFindNode(target)
				for _, r := range returned {
					n.table.Add(r)
				}
				newNodes = append(newNodes, returned...)
			}
		}
		candidate := unique(append(shortlist, newNodes...))
		sort.Slice(candidate, func(i, j int) bool {
			return xorDist(candidate[i], target) < xorDist(candidate[j], target)
		})
		if len(candidate) > K {
			candidate = candidate[:K]
		}
		if slicesEqual(candidate, shortlist) {
			break
		}
		shortlist = candidate
	}
	return shortlist
}

// Put stores value at the K nodes closest to key.
func (n *Node) Put(key int, value string) {
	for _, nid := range n.Lookup(key) {
		if remote, ok := n.net.nodes[nid]; ok {
			remote.RPCStore(key, value)
		}
	}
}

// Get retrieves value for key from the network.
func (n *Node) Get(key int) (string, bool) {
	seen := map[int]bool{n.id: true}
	shortlist := n.table.Closest(key, ALPHA)

	for {
		var newNodes []int
		for _, nid := range shortlist {
			if seen[nid] {
				continue
			}
			seen[nid] = true
			if remote, ok := n.net.nodes[nid]; ok {
				val, found, nodes := remote.RPCFindValue(key)
				if found {
					return val, true
				}
				for _, r := range nodes {
					n.table.Add(r)
				}
				newNodes = append(newNodes, nodes...)
			}
		}
		candidate := unique(append(shortlist, newNodes...))
		sort.Slice(candidate, func(i, j int) bool {
			return xorDist(candidate[i], key) < xorDist(candidate[j], key)
		})
		if len(candidate) > K {
			candidate = candidate[:K]
		}
		if slicesEqual(candidate, shortlist) {
			return "", false
		}
		shortlist = candidate
	}
}

// Network is an in-memory simulated Kademlia network.
type Network struct {
	nodes map[int]*Node
}

func NewNetwork() *Network {
	return &Network{nodes: make(map[int]*Node)}
}

func (net *Network) Join(id int) *Node {
	node := NewNode(id, net)
	i := 0
	for existingID := range net.nodes {
		if i >= K {
			break
		}
		node.table.Add(existingID)
		net.nodes[existingID].table.Add(id)
		i++
	}
	net.nodes[id] = node
	if len(net.nodes) > 1 {
		node.Lookup(id)
	}
	return node
}

func unique(s []int) []int {
	seen := make(map[int]bool, len(s))
	out := make([]int, 0, len(s))
	for _, v := range s {
		if !seen[v] {
			seen[v] = true
			out = append(out, v)
		}
	}
	return out
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

func main() {
	net := NewNetwork()
	nodeIDs := []int{7, 23, 45, 67, 89, 112, 134, 156, 178, 200, 12, 34, 56, 78, 100, 120}
	nodes := make([]*Node, len(nodeIDs))
	for i, id := range nodeIDs {
		nodes[i] = net.Join(id)
	}

	key := 42
	value := "hello kademlia"
	nodes[0].Put(key, value)

	result, found := nodes[len(nodes)-1].Get(key)
	fmt.Printf("get(%d) = %q (found=%v)\n", key, result, found)

	target := 100
	closest := nodes[0].Lookup(target)
	fmt.Printf("\nClosest %d nodes to %d:\n", K, target)
	for _, nid := range closest {
		fmt.Printf("  node %3d  XOR dist %d\n", nid, xorDist(nid, target))
	}
}
