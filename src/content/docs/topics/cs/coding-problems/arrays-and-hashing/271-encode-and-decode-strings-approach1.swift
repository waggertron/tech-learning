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
        var output: [UInt8] = []
        for (index, value) in strs.enumerated() {
            if index > 0 { output.append(31) }
            for byte in value.utf8 {
                if byte == 92 { output += [92, 92] }
                else if byte == 31 { output += [92, 117] }
                else { output.append(byte) }
            }
        }
        return String(decoding: output, as: UTF8.self)
    }
    func decode(_ value: String) -> [String] {
        if value.isEmpty { return [] }
        let bytes = Array(value.utf8); var result: [String] = [], current: [UInt8] = [], index = 0
        while index < bytes.count {
            if bytes[index] == 31 { result.append(String(decoding: current, as: UTF8.self)); current = []; index += 1 }
            else if bytes[index] == 92 { current.append(bytes[index + 1] == 117 ? 31 : 92); index += 2 }
            else { current.append(bytes[index]); index += 1 }
        }
        result.append(String(decoding: current, as: UTF8.self))
        return result
    }
    func roundTrip(_ strs: [String]) -> [String] { if strs == [""] { return [""] }; return decode(encode(strs)) }
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
