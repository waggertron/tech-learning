def remove_duplicates(s: str) -> str:
    pass  # TODO: implement

def _run_tests():
    assert remove_duplicates("abbaca") == "ca"
    assert remove_duplicates("azxxzy") == "ay"
    assert remove_duplicates("a") == "a"
    assert remove_duplicates("aa") == ""
    assert remove_duplicates("abcd") == "abcd"
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
