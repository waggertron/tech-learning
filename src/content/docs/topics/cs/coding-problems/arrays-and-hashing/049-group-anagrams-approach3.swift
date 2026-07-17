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
    private func normalized(_ groups: [[String]]) -> [[String]] {
        groups.map { $0.sorted() }.sorted {
            $0.joined(separator: "\u{1F}") < $1.joined(separator: "\u{1F}")
        }
    }

    func groupAnagrams(_ strs: [String]) -> [[String]] {
        var groups: [[Int]: [String]] = [:]
        for word in strs {
            var counts = Array(repeating: 0, count: 26)
            for byte in word.utf8 { counts[Int(byte - 97)] += 1 }
            groups[counts, default: []].append(word)
        }
        return normalized(Array(groups.values))
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d43a5b14b33d547a02397e45160c7186576c29103b9aec512421ffe4de0451bf
    expectEqual(Solution().groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]), [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]], "canonical")
    expectEqual(Solution().groupAnagrams([""]), [[""]], "empty-string")
    expectEqual(Solution().groupAnagrams(["a"]), [["a"]], "single")
    expectEqual(Solution().groupAnagrams(["abc", "bca", "cab"]), [["abc", "bca", "cab"]], "one-group")
    expectEqual(Solution().groupAnagrams(["a", "b", "c"]), [["a"], ["b"], ["c"]], "separate-groups")
    // EXCLUDED_VECTOR empty-input: [[]] | The input contains at least one string.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
