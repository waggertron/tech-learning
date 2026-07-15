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
    func hammingWeight(_ n: UInt32) -> Int {
        var value = n
        var count = 0
        for _ in 0..<32 {
            count += Int(value & 1)
            value >>= 1
        }
        return count
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:6758e68221f4091cb20daa116446074a528e3f585f2a129f8c7121da1d641d3e
    expectEqual(Solution().hammingWeight(11), 3, "three-set-bits")
    expectEqual(Solution().hammingWeight(128), 1, "single-high-bit")
    expectEqual(Solution().hammingWeight(183), 6, "mixed-six-bits")
    expectEqual(Solution().hammingWeight(2863311530), 16, "alternating-bits")
    expectEqual(Solution().hammingWeight(0), 0, "zero")
    expectEqual(Solution().hammingWeight(4294967295), 32, "all-bits-set")
    // EXCLUDED_VECTOR negative-input: [-1] | The input is an unsigned 32-bit integer.
    // EXCLUDED_VECTOR above-unsigned-32-bit-range: [4294967296] | The input is an unsigned 32-bit integer.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
