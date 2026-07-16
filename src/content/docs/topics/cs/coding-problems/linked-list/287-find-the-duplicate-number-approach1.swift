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
func findDuplicate(_ nums: [Int]) -> Int {
        let sorted = nums.sorted()
        for index in 1..<sorted.count where sorted[index] == sorted[index - 1] {
            return sorted[index]
        }
        return -1
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:09438b1c0a127ee2b31d8c539eb6406cf30094088e5a74fe97b96abfefd8aa07
    expectEqual(Solution().findDuplicate([1, 3, 4, 2, 2]), 2, "duplicate-two")
    expectEqual(Solution().findDuplicate([3, 1, 3, 4, 2]), 3, "duplicate-three")
    expectEqual(Solution().findDuplicate([2, 2, 2, 2, 2]), 2, "many-repetitions")
    expectEqual(Solution().findDuplicate([1, 1]), 1, "smallest-input")
    // EXCLUDED_VECTOR no-duplicate: [[1,2,3]] | The published input contains exactly one repeated value.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
