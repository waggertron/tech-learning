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
    func checkInclusion(_ s1: String, _ s2: String) -> Bool {
        var permutations: Set<String> = []
        let characters = Array(s1)
        var used = Array(repeating: false, count: characters.count), current: [Character] = []
        func generate() {
            if current.count == characters.count { permutations.insert(String(current)); return }
            for index in characters.indices where !used[index] {
                used[index] = true; current.append(characters[index]); generate(); current.removeLast(); used[index] = false
            }
        }
        generate()
        return permutations.contains { s2.contains($0) }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:625e867f4583523bc5a748d2186d7f4ce74a6b637784e7b49acfdc1e95ed670c
    expectEqual(Solution().checkInclusion("ab", "eidbaooo"), true, "permutation-present")
    expectEqual(Solution().checkInclusion("ab", "eidboaoo"), false, "permutation-missing")
    expectEqual(Solution().checkInclusion("adc", "dcda"), true, "overlapping-window")
    expectEqual(Solution().checkInclusion("aabc", "caaebcaab"), true, "repeated-characters")
    expectEqual(Solution().checkInclusion("a", "a"), true, "single-character")
    expectEqual(Solution().checkInclusion("abcd", "abc"), false, "pattern-longer-than-text")
    // EXCLUDED_VECTOR empty-pattern: ["","abc"] | The pattern must contain at least one lowercase letter.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
