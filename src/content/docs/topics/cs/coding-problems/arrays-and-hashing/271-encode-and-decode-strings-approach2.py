import json

def encode(strs: list[str]) -> str:
    return json.dumps(strs)

def decode(s: str) -> list[str]:
    return json.loads(s)

cases = [['hello', 'world', 'foo', 'bar'], [''], ['a'], [], ['hello#world', 'foo#bar'], ['5#abc', 'def']]
for strs in cases:
    assert decode(encode(strs)) == strs, f'Failed on: {strs}'
print("all tests pass")
