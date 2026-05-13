package main

import (
	"fmt"
	"sort"
)

func accountsMerge(accounts [][]string) [][]string {
	parent := map[string]string{}

	var find func(x string) string
	find = func(x string) string {
		if parent[x] != x {
			parent[x] = find(parent[x])
		}
		return parent[x]
	}

	union := func(a, b string) {
		parent[find(a)] = find(b)
	}

	emailToName := map[string]string{}

	for _, account := range accounts {
		name := account[0]
		for _, email := range account[1:] {
			if _, ok := parent[email]; !ok {
				parent[email] = email
			}
			emailToName[email] = name
			union(account[1], email)
		}
	}

	groups := map[string][]string{}
	for email := range parent {
		root := find(email)
		groups[root] = append(groups[root], email)
	}

	result := [][]string{}
	for root, emails := range groups {
		sort.Strings(emails)
		row := append([]string{emailToName[root]}, emails...)
		result = append(result, row)
	}
	return result
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

func normalizeAccounts(result [][]string) [][]string {
	for i := range result {
		emails := result[i][1:]
		sort.Strings(emails)
		result[i] = append(result[i][:1], emails...)
	}
	sort.Slice(result, func(i, j int) bool {
		return fmt.Sprint(result[i]) < fmt.Sprint(result[j])
	})
	return result
}

func eqAccounts(a, b [][]string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func runTests() {
	a1 := [][]string{
		{"John", "johnsmith@mail.com", "john_newyork@mail.com"},
		{"John", "johnsmith@mail.com", "john00@mail.com"},
		{"Mary", "mary@mail.com"},
		{"John", "johnnybravo@mail.com"},
	}
	expected1 := [][]string{
		{"John", "john00@mail.com", "john_newyork@mail.com", "johnsmith@mail.com"},
		{"John", "johnnybravo@mail.com"},
		{"Mary", "mary@mail.com"},
	}
	r1 := normalizeAccounts(accountsMerge(a1))
	e1 := normalizeAccounts(expected1)
	assert(eqAccounts(r1, e1), fmt.Sprintf("got %v", r1))

	a2 := [][]string{{"Alice", "a@x.com"}}
	r2 := normalizeAccounts(accountsMerge(a2))
	assert(eqAccounts(r2, [][]string{{"Alice", "a@x.com"}}))

	fmt.Println("all tests pass")
}

func main() { runTests() }
