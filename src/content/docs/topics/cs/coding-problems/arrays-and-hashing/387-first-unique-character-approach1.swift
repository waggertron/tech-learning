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
    func firstUniqChar(_ s: String) -> Int {
        var counts: [Character: Int] = [:]; for char in s { counts[char, default: 0] += 1 }
        for (index, char) in s.enumerated() where counts[char] == 1 { return index }
        return -1
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:ad83a223cf687450298331b381eb9dd7a50ccc116d02c7c01abb929101bcf0a0
    expectEqual(Solution().firstUniqChar("leetcode"), 0, "first")
    expectEqual(Solution().firstUniqChar("loveleetcode"), 2, "middle")
    expectEqual(Solution().firstUniqChar("aabb"), -1, "none")
    expectEqual(Solution().firstUniqChar("z"), 0, "single")
    expectEqual(Solution().firstUniqChar("aab"), 2, "last")
    // EXCLUDED_VECTOR empty: [""] | The input contains at least one lowercase letter.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
