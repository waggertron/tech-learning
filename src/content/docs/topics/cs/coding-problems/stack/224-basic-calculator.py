def calculate(s: str) -> int:
    pass  # TODO: implement

def _run_tests():
    assert calculate("1 + 1") == 2
    assert calculate(" 2-1 + 2 ") == 3
    assert calculate("(1+(4+5+2)-3)+(6+8)") == 23
    assert calculate("1-(     -2)") == 3
    assert calculate("- (3 + (4 + 5))") == -12
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
