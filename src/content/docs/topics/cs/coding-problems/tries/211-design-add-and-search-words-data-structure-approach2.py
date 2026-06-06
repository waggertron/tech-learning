from collections import defaultdict

class WordDictionary:
    def __init__(self) -> None:
        self.by_len: defaultdict[int, list[str]] = defaultdict(list)

    def addWord(self, word: str) -> None:
        self.by_len[len(word)].append(word)

    def search(self, word: str) -> bool:
        for w in self.by_len.get(len(word), []):
            if all(p == '.' or p == c for p, c in zip(word, w)):
                return True
        return False

wd = WordDictionary()
wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad")
assert wd.search("pad") == False
assert wd.search("bad") == True
assert wd.search(".ad") == True
assert wd.search("b..") == True
assert wd.search("...") == True
assert wd.search("....") == False
print("all tests pass")
