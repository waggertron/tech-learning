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
    func threeSum(_ nums: [Int]) -> [[Int]] {
        let values = nums.sorted()
        var result: [[Int]] = []
        guard values.count >= 3 else { return result }
        for first in 0..<(values.count - 2) {
            for second in (first + 1)..<(values.count - 1) {
                for third in (second + 1)..<values.count where values[first] + values[second] + values[third] == 0 {
                    let triplet = [values[first], values[second], values[third]]
                    if result.last != triplet && !result.contains(triplet) {
                        result.append(triplet)
                    }
                }
            }
        }
        return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:2d2f35422e634f1e7f97f9df4b9fbc9c6b7862cb5627fcea2979e7cab539c419
    expectEqual(Solution().threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]], "mixed-values")
    expectEqual(Solution().threeSum([0, 1, 1]), [], "no-triplet")
    expectEqual(Solution().threeSum([0, 0, 0]), [[0, 0, 0]], "all-zero")
    expectEqual(Solution().threeSum([-2, 0, 1, 1, 2]), [[-2, 0, 2], [-2, 1, 1]], "duplicate-values")
    expectEqual(Solution().threeSum([1, 2, -2]), [], "minimum-length-no-answer")
    // EXCLUDED_VECTOR too-short: [[0,0]] | At least three values are required to form a triplet.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
