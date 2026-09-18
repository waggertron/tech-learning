function findSubstring(s: string, words: string[]): number[] {
  const wordLength = words[0].length;
  const required = new Map<string, number>();
  for (const word of words) required.set(word, (required.get(word) ?? 0) + 1);
  const answer: number[] = [];

  for (let offset = 0; offset < wordLength; offset++) {
    let left = offset;
    let used = 0;
    const window = new Map<string, number>();

    for (let right = offset; right + wordLength <= s.length; right += wordLength) {
      const word = s.slice(right, right + wordLength);
      if (!required.has(word)) {
        window.clear();
        used = 0;
        left = right + wordLength;
        continue;
      }

      window.set(word, (window.get(word) ?? 0) + 1);
      used++;
      while ((window.get(word) ?? 0) > required.get(word)!) {
        const outgoing = s.slice(left, left + wordLength);
        window.set(outgoing, window.get(outgoing)! - 1);
        used--;
        left += wordLength;
      }

      if (used === words.length) {
        answer.push(left);
        const outgoing = s.slice(left, left + wordLength);
        window.set(outgoing, window.get(outgoing)! - 1);
        used--;
        left += wordLength;
      }
    }
  }
  return answer.sort((a, b) => a - b);
}

function assert(condition: boolean, message = "assertion failed"): void {
  if (!condition) throw new Error(message);
}

function runTests(): void {
    // TEST_VECTORS_BEGIN sha256:4ed0b0ef6a0b4d4fb8b885ec9e435566d59c98b9fe89fa186c9196f08aa9ef0d
    assert(JSON.stringify(findSubstring("barfoothefoobarman", ["foo", "bar"])) === JSON.stringify([0, 9]), "canonical-two-words");
    assert(JSON.stringify(findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "word"])) === JSON.stringify([]), "missing-required-duplicate");
    assert(JSON.stringify(findSubstring("barfoofoobarthefoobarman", ["bar", "foo", "the"])) === JSON.stringify([6, 9, 12]), "three-overlapping-matches");
    assert(JSON.stringify(findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "good"])) === JSON.stringify([8]), "duplicate-word-required");
    assert(JSON.stringify(findSubstring("aaaaaa", ["aa", "aa"])) === JSON.stringify([0, 1, 2]), "overlapping-identical-words");
    assert(JSON.stringify(findSubstring("foobar", ["foo", "bar"])) === JSON.stringify([0]), "exact-whole-string");
    assert(JSON.stringify(findSubstring("foo", ["foo", "bar"])) === JSON.stringify([]), "text-shorter-than-concatenation");
    // EXCLUDED_VECTOR empty-word-list: ["foo",[]] | The word list must contain at least one word.
    // EXCLUDED_VECTOR unequal-word-lengths: ["foobar",["foo","ba"]] | Every word must have the same length.
    // TEST_VECTORS_END
  console.log("all tests pass");
}

runTests();
