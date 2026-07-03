def is_isomorphic(s: str, t: str) -> bool:
    pass  # TODO: implement


def _run_tests():
    assert is_isomorphic("egg", "add") is True
    assert is_isomorphic("f11", "b23") is False
    assert is_isomorphic("paper", "title") is True
    assert is_isomorphic("badc", "baba") is False
    assert is_isomorphic("a", "a") is True
    assert is_isomorphic("ab", "aa") is False
    assert is_isomorphic("foo", "bar") is False

    # --- large-input timing ---
    import time as _t

    n = 50000
    s = "ab" * (n // 2)
    t = "xy" * (n // 2)
    _t0 = _t.perf_counter()
    is_isomorphic(s, t)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f"perf is_isomorphic n={n}: {_ms:.1f}ms")
    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
