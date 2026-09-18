from collections import Counter


def find_substring(s: str, words: list[str]) -> list[int]:
    word_length = len(words[0])
    word_count = len(words)
    window_length = word_length * word_count
    required = Counter(words)
    answer: list[int] = []

    for start in range(len(s) - window_length + 1):
        seen: Counter[str] = Counter()
        for offset in range(0, window_length, word_length):
            word = s[start + offset : start + offset + word_length]
            seen[word] += 1
        if seen == required:
            answer.append(start)

    return answer


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
