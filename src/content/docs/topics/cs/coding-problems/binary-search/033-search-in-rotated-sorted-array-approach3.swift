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
    func search(_ nums: [Int], _ target: Int) -> Int {
        var low = 0
        var high = nums.count - 1

        while low <= high {
            let middle = low + (high - low) / 2
            if nums[middle] == target { return middle }

            if nums[low] <= nums[middle] {
                if nums[low] <= target && target < nums[middle] {
                    high = middle - 1
                } else {
                    low = middle + 1
                }
            } else if nums[middle] < target && target <= nums[high] {
                low = middle + 1
            } else {
                high = middle - 1
            }
        }
        return -1
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:aa76c43e396729ad1a89e8dacfe1ef6e488e3b5c462f798d3b370896816fb9ac
    expectEqual(Solution().search([4, 5, 6, 7, 0, 1, 2], 0), 4, "target-after-pivot")
    expectEqual(Solution().search([4, 5, 6, 7, 0, 1, 2], 6), 2, "target-before-pivot")
    expectEqual(Solution().search([4, 5, 6, 7, 0, 1, 2], 3), -1, "target-absent")
    expectEqual(Solution().search([1], 1), 0, "single-element-found")
    expectEqual(Solution().search([1], 0), -1, "single-element-missing")
    expectEqual(Solution().search([1, 2, 3], 3), 2, "not-rotated")
    // EXCLUDED_VECTOR empty-array: [[],1] | The problem contract requires at least one array element.
    // EXCLUDED_VECTOR duplicate-values: [[2,2,3,1],2] | The problem contract requires distinct values.
    // EXCLUDED_VECTOR multiple-order-breaks: [[3,1,4,2],4] | The array must be one rotation of a strictly increasing sequence.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
