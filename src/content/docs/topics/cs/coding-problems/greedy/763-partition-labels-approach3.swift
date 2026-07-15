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
        var bounds: [Character: (Int, Int)] = [:]
        for (index, character) in characters.enumerated() {
            bounds[character] = (bounds[character]?.0 ?? index, index)
        }
        let intervals = bounds.values.sorted { $0.0 < $1.0 }
        var merged: [(Int, Int)] = []
        for interval in intervals {
            if let last = merged.last, interval.0 <= last.1 { merged[merged.count - 1].1 = max(last.1, interval.1) }
            else { merged.append(interval) }
        }
        return merged.map { $0.1 - $0.0 + 1 }
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
