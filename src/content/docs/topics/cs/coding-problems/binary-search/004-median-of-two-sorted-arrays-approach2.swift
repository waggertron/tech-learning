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
    func findMedianSortedArrays(_ nums1: [Int], _ nums2: [Int]) -> Double {
        let total = nums1.count + nums2.count
        let middle = total / 2
        var firstIndex = 0
        var secondIndex = 0
        var previous = 0
        var current = 0

        for _ in 0...middle {
            previous = current
            if firstIndex < nums1.count &&
                (secondIndex >= nums2.count || nums1[firstIndex] <= nums2[secondIndex]) {
                current = nums1[firstIndex]
                firstIndex += 1
            } else {
                current = nums2[secondIndex]
                secondIndex += 1
            }
        }

        if total.isMultiple(of: 2) {
            return (Double(previous) + Double(current)) / 2
        }
        return Double(current)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:40b5000f22b577cf0ad54af83d7f434ab0c35795ebb25a85c8541a07864e84c0
    expectEqual(Solution().findMedianSortedArrays([1, 3], [2]), 2, "odd-total-length")
    expectEqual(Solution().findMedianSortedArrays([1, 2], [3, 4]), 2.5, "even-total-length")
    expectEqual(Solution().findMedianSortedArrays([], [1]), 1, "first-array-empty")
    expectEqual(Solution().findMedianSortedArrays([2], []), 2, "second-array-empty")
    expectEqual(Solution().findMedianSortedArrays([-5, -3], [-4, -2]), -3.5, "negative-values")
    // EXCLUDED_VECTOR both-arrays-empty: [[],[]] | The combined input must contain at least one value.
    // EXCLUDED_VECTOR first-array-unsorted: [[3,1],[2]] | Each input array must be sorted in ascending order.
    // EXCLUDED_VECTOR second-array-unsorted: [[1],[3,2]] | Each input array must be sorted in ascending order.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
