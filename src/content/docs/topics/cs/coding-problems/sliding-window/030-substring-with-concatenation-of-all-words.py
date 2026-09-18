def find_substring(s: str, words: list[str]) -> list[int]:
    # TODO: Return every starting index whose window contains all words exactly once.
    return []


def _run_tests() -> None:
    # TEST_VECTORS_BEGIN sha256:4ed0b0ef6a0b4d4fb8b885ec9e435566d59c98b9fe89fa186c9196f08aa9ef0d
    assert find_substring("barfoothefoobarman", ["foo", "bar"]) == [0, 9], "canonical-two-words"
    assert find_substring("wordgoodgoodgoodbestword", ["word", "good", "best", "word"]) == [], "missing-required-duplicate"
    assert find_substring("barfoofoobarthefoobarman", ["bar", "foo", "the"]) == [6, 9, 12], "three-overlapping-matches"
    assert find_substring("wordgoodgoodgoodbestword", ["word", "good", "best", "good"]) == [8], "duplicate-word-required"
    assert find_substring("aaaaaa", ["aa", "aa"]) == [0, 1, 2], "overlapping-identical-words"
    assert find_substring("foobar", ["foo", "bar"]) == [0], "exact-whole-string"
    assert find_substring("foo", ["foo", "bar"]) == [], "text-shorter-than-concatenation"
    # EXCLUDED_VECTOR empty-word-list: ["foo",[]] | The word list must contain at least one word.
    # EXCLUDED_VECTOR unequal-word-lengths: ["foobar",["foo","ba"]] | Every word must have the same length.
    # TEST_VECTORS_END
    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
