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
    func reverseBits(_ n: UInt32) -> UInt32 {
        let binary = String(n, radix: 2)
        let padded = String(repeating: "0", count: 32 - binary.count) + binary
        return UInt32(String(padded.reversed()), radix: 2) ?? 0
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:78820ec8097620b79b00ac5774c0ffc446444091708f32df384a56facd9d73a9
    expectEqual(Solution().reverseBits(43261596), 964176192, "mixed-bits")
    expectEqual(Solution().reverseBits(4294967293), 3221225471, "high-and-low-bits")
    expectEqual(Solution().reverseBits(2863311530), 1431655765, "alternating-bits")
    expectEqual(Solution().reverseBits(0), 0, "zero")
    expectEqual(Solution().reverseBits(1), 2147483648, "one")
    expectEqual(Solution().reverseBits(4294967295), 4294967295, "all-bits-set")
    // EXCLUDED_VECTOR negative-input: [-1] | The input is an unsigned 32-bit integer.
    // EXCLUDED_VECTOR above-unsigned-32-bit-range: [4294967296] | The input is an unsigned 32-bit integer.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
