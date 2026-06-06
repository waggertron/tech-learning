from collections import defaultdict

def accounts_merge(accounts: list[list[str]]) -> list[list[str]]:
    pass  # TODO: implement

def _run_tests():
    def normalize(result):
        return sorted([row[0:1] + sorted(row[1:]) for row in result])

    a1 = [
        ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
        ["John", "johnsmith@mail.com", "john00@mail.com"],
        ["Mary", "mary@mail.com"],
        ["John", "johnnybravo@mail.com"],
    ]
    r1 = normalize(accounts_merge(a1))
    expected1 = normalize([
        ["John", "john00@mail.com", "john_newyork@mail.com", "johnsmith@mail.com"],
        ["Mary", "mary@mail.com"],
        ["John", "johnnybravo@mail.com"],
    ])
    assert r1 == expected1, f"Expected {expected1}, got {r1}"
    a2 = [["Alice", "a@x.com"]]
    assert normalize(accounts_merge(a2)) == [["Alice", "a@x.com"]]
    a3 = [["A", "x@y.com", "a@b.com"], ["A", "x@y.com", "c@d.com"]]
    assert normalize(accounts_merge(a3)) == [["A", "a@b.com", "c@d.com", "x@y.com"]]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big = [[f"User{i}", f"email{i}@x.com", f"shared@x.com"] for i in range(200)]
    accounts_merge(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf accounts-merge 200 accounts sharing one email: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
