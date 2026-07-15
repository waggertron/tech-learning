def count_bits(n: int) -> list[int]:
    counts = [0] * (n + 1)
    for value in range(1, n + 1):
        counts[value] = counts[value >> 1] + (value & 1)
    return counts


def run_tests() -> None:
    # TEST_VECTORS_BEGIN sha256:c6ee896d6c38441fea68d4a24bb494a2ee8d855229cff1259c3e14c3c9159da0
    assert count_bits(2) == [0, 1, 1], "through-two"
    assert count_bits(5) == [0, 1, 1, 2, 1, 2], "through-five"
    assert count_bits(8) == [0, 1, 1, 2, 1, 2, 2, 3, 1], "through-eight"
    assert count_bits(0) == [0], "zero"
    assert count_bits(1) == [0, 1], "one"
    # EXCLUDED_VECTOR negative-input: [-1] | The input contract requires n to be nonnegative.
    # EXCLUDED_VECTOR above-constraint: [100001] | The published problem constraint limits n to 100000.
    # TEST_VECTORS_END
    print("All shared test vectors passed")


if __name__ == "__main__":
    run_tests()
