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
    func mergeTriplets(_ triplets: [[Int]], _ target: [Int]) -> Bool {
        var mask = 0
        for triplet in triplets {
            if zip(triplet, target).contains(where: { $0 > $1 }) { continue }
            for channel in 0..<3 where triplet[channel] == target[channel] { mask |= 1 << channel }
            if mask == 0b111 { return true }
        }
        return false
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c9f6d8ee0f528bf668ce3c16e47f2ef787cba3fe4d2d2538e720c662806806a5
    expectEqual(Solution().mergeTriplets([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]), true, "merge-reaches-target")
    expectEqual(Solution().mergeTriplets([[3, 4, 5], [4, 5, 6]], [3, 2, 5]), false, "oversized-required-channel")
    expectEqual(Solution().mergeTriplets([[1, 1, 1]], [1, 1, 1]), true, "single-exact-triplet")
    // EXCLUDED_VECTOR malformed-triplet: [[[1,2]],[1,2,3]] | Every triplet and the target must contain exactly three values.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
