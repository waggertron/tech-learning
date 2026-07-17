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
    func encode(_ strs: [String]) -> String {
        func quoted(_ value: String) -> String {
            var result = "\""
            for char in value {
                switch char {
                case "\"": result += "\\\""
                case "\\": result += "\\\\"
                case "\n": result += "\\n"
                case "\r": result += "\\r"
                case "\t": result += "\\t"
                default: result.append(char)
                }
            }
            return result + "\""
        }
        return "[" + strs.map(quoted).joined(separator: ",") + "]"
    }
    func decode(_ value: String) -> [String] {
        let bytes = Array(value.utf8)
        if bytes == [91, 93] { return [] }
        var result: [String] = [], index = 1
        while index < bytes.count - 1 {
            index += 1
            var current: [UInt8] = []
            while bytes[index] != 34 {
                if bytes[index] == 92 {
                    index += 1
                    let escaped: [UInt8: UInt8] = [34: 34, 92: 92, 110: 10, 114: 13, 116: 9]
                    current.append(escaped[bytes[index]]!)
                } else { current.append(bytes[index]) }
                index += 1
            }
            result.append(String(decoding: current, as: UTF8.self))
            index += 1
            if index < bytes.count - 1 { index += 1 }
        }
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
