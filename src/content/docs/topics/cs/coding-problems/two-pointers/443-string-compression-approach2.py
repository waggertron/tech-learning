from typing import List

def compress(chars: List[str]) -> int:
    write = 0
    i = 0
    while i < len(chars):
        char = chars[i]
        count = 0
        while i < len(chars) and chars[i] == char:
            count += 1
            i += 1
        chars[write] = char
        write += 1
        if count > 1:
            for digit in str(count):
                chars[write] = digit
                write += 1
    return write

chars1 = ['a', 'a', 'b', 'b', 'c', 'c', 'c']
n1 = compress(chars1)
print(n1, chars1[:n1])  # 6 ['a', '2', 'b', '2', 'c', '3']
