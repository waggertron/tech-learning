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
    func letterCombinations(_ digits: String) -> [String] {
        let map: [Character: [Character]] = ["2": Array("abc"), "3": Array("def"), "4": Array("ghi"), "5": Array("jkl"), "6": Array("mno"), "7": Array("pqrs"), "8": Array("tuv"), "9": Array("wxyz")]
        let values = Array(digits); if values.isEmpty { return [] }; var result: [String] = []
        func search(_ index: Int, _ current: [Character]) { if index == values.count { result.append(String(current)); return }; for letter in map[values[index]]! { search(index + 1, current + [letter]) } }
        search(0, []); return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c0da4c4daa1c1d6eb9ccc6ee596f79d84f1b45b55115093615f7bce8699c12bd
    expectEqual(Solution().letterCombinations("23"), ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"], "two-digits")
    expectEqual(Solution().letterCombinations("2"), ["a", "b", "c"], "one-digit")
    expectEqual(Solution().letterCombinations(""), [], "empty")
    expectEqual(Solution().letterCombinations("7"), ["p", "q", "r", "s"], "four-letter-digit")
    expectEqual(Solution().letterCombinations("22"), ["aa", "ab", "ac", "ba", "bb", "bc", "ca", "cb", "cc"], "repeated-digit")
    // EXCLUDED_VECTOR unsupported-digit: ["1"] | Digits are between 2 and 9.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
