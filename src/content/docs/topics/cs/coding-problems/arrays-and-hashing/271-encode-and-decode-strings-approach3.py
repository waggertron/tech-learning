def encode(strs: list[str]) -> str:
    return "".join(f"{len(s)}#{s}" for s in strs)

def decode(s: str) -> list[str]:
    result, i = [], 0
    while i < len(s):
        j = s.index('#', i)
        length = int(s[i:j])
        result.append(s[j + 1:j + 1 + length])
        i = j + 1 + length
    return result

cases = [['hello', 'world', 'foo', 'bar'], [''], ['a'], [], ['hello#world', 'foo#bar'], ['5#abc', 'def']]
for strs in cases:
    assert decode(encode(strs)) == strs, f'Failed on: {strs}'
print("all tests pass")
