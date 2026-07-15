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
            if nums[middle] < target {
                low = middle + 1
            } else {
                high = middle - 1
            }
        }
        return -1
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:936f285301e724f71bb2514961a2e454bf17572a4553be66fe381c85e315c253
    expectEqual(Solution().search([-1, 0, 3, 5, 9, 12], 9), 4, "target-present-middle")
    expectEqual(Solution().search([-1, 0, 3, 5, 9, 12], 2), -1, "target-absent")
    expectEqual(Solution().search([5], 5), 0, "single-element-found")
    expectEqual(Solution().search([5], 3), -1, "single-element-missing")
    expectEqual(Solution().search([-1, 0, 3, 5, 9, 12], -1), 0, "first-element")
    expectEqual(Solution().search([-1, 0, 3, 5, 9, 12], 12), 5, "last-element")
    // EXCLUDED_VECTOR empty-array: [[],4] | The LeetCode contract requires at least one array element.
    // EXCLUDED_VECTOR unsorted-array: [[3,1,2],1] | Binary search requires the input array to be sorted in ascending order.
    // EXCLUDED_VECTOR duplicate-values: [[1,1,2],1] | LeetCode 704 states that every array value is unique.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
