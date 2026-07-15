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
    func partitionLabels(_ s: String) -> [Int] {
        let characters = Array(s)
        func valid(_ start: Int, _ end: Int) -> Bool {
            let inside = Set(characters[start...end])
            for index in characters.indices where (index < start || index > end) && inside.contains(characters[index]) { return false }
            return true
        }
        func split(_ start: Int) -> [Int]? {
            if start == characters.count { return [] }
            for end in start..<characters.count where valid(start, end) {
                if let rest = split(end + 1) { return [end - start + 1] + rest }
            }
            return nil
        }
        return split(0) ?? []
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:38d121cfeae22cf3daf959475a389777a876ab588da967ebe3256654d4b8e207
    expectEqual(Solution().partitionLabels("ababcbacadefegdehijhklij"), [9, 7, 8], "classic-partitions")
    expectEqual(Solution().partitionLabels("abc"), [1, 1, 1], "unique-characters")
    expectEqual(Solution().partitionLabels("a"), [1], "single-character")
    // EXCLUDED_VECTOR uppercase-character: ["aA"] | The problem contract accepts lowercase English letters only.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
