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
    func encode(_ strs: [String]) -> String { strs.map { "\($0.utf8.count)#\($0)" }.joined() }
    func decode(_ value: String) -> [String] {
        let bytes = Array(value.utf8); var result: [String] = [], index = 0
        while index < bytes.count { var end = index; while bytes[end] != 35 { end += 1 }; let length = Int(String(decoding: bytes[index..<end], as: UTF8.self))!; let start = end + 1; result.append(String(decoding: bytes[start..<(start + length)], as: UTF8.self)); index = start + length }
        return result
    }
    func roundTrip(_ strs: [String]) -> [String] { decode(encode(strs)) }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:857c24e0b148e76928da40080f30a43d9be2d9163970508320769b1b60b61748
    expectEqual(Solution().roundTrip(["hello", "world"]), ["hello", "world"], "words")
    expectEqual(Solution().roundTrip([""]), [""], "empty-string")
    expectEqual(Solution().roundTrip([]), [], "empty-list")
    expectEqual(Solution().roundTrip(["a#b", "12", "x|y"]), ["a#b", "12", "x|y"], "delimiter-and-digits")
    expectEqual(Solution().roundTrip(["a\\b", "plain"]), ["a\\b", "plain"], "backslash")
    // EXCLUDED_VECTOR ascii-only: [["🐉"]] | The original problem limits inputs to valid ASCII characters.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
