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

func accountsMerge(accounts [][]string) [][]string {
	// TODO: implement
	return nil
}

func normalizeAccounts(result [][]string) [][]string {
	// sort emails within each account, then sort accounts
	for i := range result {
		emails := result[i][1:]
		// simple insertion sort for small slices
		for j := 1; j < len(emails); j++ {
			for k := j; k > 0 && emails[k] < emails[k-1]; k-- {
				emails[k], emails[k-1] = emails[k-1], emails[k]
			}
		}
		result[i] = append(result[i][:1], emails...)
	}
	// sort accounts by joined string
	for i := 1; i < len(result); i++ {
		for j := i; j > 0; j-- {
			ki := fmt.Sprint(result[j])
			kj := fmt.Sprint(result[j-1])
			if ki < kj {
				result[j], result[j-1] = result[j-1], result[j]
			} else {
				break
			}
		}
	}
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
