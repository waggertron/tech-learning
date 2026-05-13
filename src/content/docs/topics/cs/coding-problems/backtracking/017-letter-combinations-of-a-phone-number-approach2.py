def letter_combinations(digits):
    if not digits:
        return []
    mapping = {"2":"abc","3":"def","4":"ghi","5":"jkl",
               "6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
    result = []
    path = []

    def backtrack(i):
        if i == len(digits):
            result.append("".join(path))  # L1: O(n) join when complete
            return
        for ch in mapping[digits[i]]:     # L2: loop over letters for digit i
            path.append(ch)               # L3: O(1) push
            backtrack(i + 1)              # L4: recurse
            path.pop()                    # L5: O(1) pop

    backtrack(0)
    return result

assert sorted(letter_combinations("23")) == sorted(["ad","ae","af","bd","be","bf","cd","ce","cf"])
assert letter_combinations("") == []
assert sorted(letter_combinations("2")) == ["a","b","c"]
assert sorted(letter_combinations("7")) == ["p","q","r","s"]
assert len(letter_combinations("22")) == 9
print("all tests pass")
