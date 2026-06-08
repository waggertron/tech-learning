from typing import List

def compress(chars: List[str]) -> int:
    pass

chars1 = ['a', 'a', 'b', 'b', 'c', 'c', 'c']
n1 = compress(chars1)
print(n1, chars1[:n1])  # 6 ['a', '2', 'b', '2', 'c', '3']

chars2 = ['a']
print(compress(chars2))  # 1

chars3 = list('abbbbbbbbbbbbb')
n3 = compress(chars3)
print(n3, chars3[:n3])  # 4 ['a', 'b', '1', '2']
