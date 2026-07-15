// LEETCODE_TYPE: Solution
func expectEqual<T: Equatable>(
    _ actual: T,
    _ expected: T,
    _ message: String = "",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard actual == expected else {
        let detail = message.isEmpty ? "values differ" : message
        fatalError("\(file):\(line): \(detail). Expected \(expected), got \(actual)")
    }
}

func expectTrue(
    _ condition: @autoclosure () -> Bool,
    _ message: String = "expected true",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard condition() else {
        fatalError("\(file):\(line): \(message)")
    }
}

func reportSuccess() {
    print("All Swift tests passed")
}
final class Solution {
    func ladderLength(_ beginWord: String, _ endWord: String, _ wordList: [String]) -> Int {
        let words = Set(wordList)
        guard words.contains(endWord) else { return 0 }
        var front = Set([beginWord]), back = Set([endWord]), visited = front.union(back)
        var steps = 1
        while !front.isEmpty {
            if front.count > back.count { swap(&front, &back) }
            var next = Set<String>()
            for word in front {
                var chars = Array(word)
                for index in chars.indices {
                    let saved = chars[index]
                    for scalar in UnicodeScalar("a").value...UnicodeScalar("z").value {
                        chars[index] = Character(UnicodeScalar(scalar)!)
                        let candidate = String(chars)
                        if back.contains(candidate) { return steps + 1 }
                        if words.contains(candidate) && visited.insert(candidate).inserted { next.insert(candidate) }
                    }
                    chars[index] = saved
                }
            }
            front = next; steps += 1
        }
        return 0
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:4b2414e123fbe73a4543101ac0e3fd2011b92f9ad1e98f6beb78be0aa8bd9f20
    expectEqual(Solution().ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]), 5, "classic-ladder")
    expectEqual(Solution().ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log"]), 0, "missing-end-word")
    expectEqual(Solution().ladderLength("a", "c", ["a", "b", "c"]), 2, "one-change")
    // EXCLUDED_VECTOR same-endpoints: ["hit","hit",["hit"]] | The problem contract requires distinct begin and end words.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
