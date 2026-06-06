from math import gcd

def gcd_of_strings(str1: str, str2: str) -> str:
    if str1 + str2 != str2 + str1:               # O(m+n) concatenate and compare
        return ""
    return str1[:gcd(len(str1), len(str2))]

def _run_tests():
    assert gcd_of_strings("ABCABC", "ABC") == "ABC"
    assert gcd_of_strings("ABABAB", "ABAB") == "AB"
    assert gcd_of_strings("LEET", "CODE") == ""
    assert gcd_of_strings("AAAAAB", "AAA") == ""
    assert gcd_of_strings("A", "A") == "A"
    assert gcd_of_strings("AAAA", "AA") == "AA"
    import time as _t
    _t0 = _t.perf_counter()
    gcd_of_strings("A" * 1000, "A" * 999)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf gcd_of_strings n=1999: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
