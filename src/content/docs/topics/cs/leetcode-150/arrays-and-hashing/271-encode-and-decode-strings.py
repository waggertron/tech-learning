def encode(strs: list[str]) -> str:
    pass  # TODO: implement

def decode(s: str) -> list[str]:
    pass  # TODO: implement

def _run_tests():
    cases = [['hello', 'world', 'foo', 'bar'], [''], ['a'], [], ['hello#world', 'foo#bar'], ['5#abc', 'def']]
    for strs in cases:
        assert decode(encode(strs)) == strs, f'Failed on: {strs}'
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
