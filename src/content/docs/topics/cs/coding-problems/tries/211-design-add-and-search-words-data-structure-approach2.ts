function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class WordDictionary {
    private byLen: Map<number, string[]> = new Map();

    addWord(word: string): void {
        if (!this.byLen.has(word.length)) this.byLen.set(word.length, []);
        this.byLen.get(word.length)!.push(word);
    }

    search(word: string): boolean {
        const candidates = this.byLen.get(word.length) ?? [];
        for (const w of candidates) {
            let match = true;
            for (let i = 0; i < word.length; i++) {
                if (word[i] !== '.' && word[i] !== w[i]) { match = false; break; }
            }
            if (match) return true;
        }
        return false;
    }
}

const wd = new WordDictionary();
wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad");
assert(wd.search("pad") === false);
assert(wd.search("bad") === true);
assert(wd.search(".ad") === true);
assert(wd.search("b..") === true);
assert(wd.search("...") === true);
assert(wd.search("....") === false);
console.log("all tests pass");
