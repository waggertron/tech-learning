from itertools import product

def letter_combinations(digits: str) -> list[str]:
    if not digits:
        return []
    mapping = {"2":"abc","3":"def","4":"ghi","5":"jkl",
               "6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
    return ["".join(p) for p in product(*(mapping[d] for d in digits))]  # L1: O(k^n · n)

assert sorted(letter_combinations("23")) == sorted(["ad","ae","af","bd","be","bf","cd","ce","cf"])
assert letter_combinations("") == []
assert sorted(letter_combinations("2")) == ["a","b","c"]
assert sorted(letter_combinations("7")) == ["p","q","r","s"]
assert len(letter_combinations("22")) == 9
print("all tests pass")
