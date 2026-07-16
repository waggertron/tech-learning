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
    func rotate(_ nums: inout [Int], _ k: Int) {
        guard !nums.isEmpty else { return }
        let offset = k % nums.count
        reverse(&nums, 0, nums.count - 1)
        reverse(&nums, 0, offset - 1)
        reverse(&nums, offset, nums.count - 1)
    }

    private func reverse(_ nums: inout [Int], _ start: Int, _ end: Int) {
        var left = start
        var right = end
        while left < right {
            nums.swapAt(left, right)
            left += 1
            right -= 1
        }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:9eca1924bcdfbf4fb356757d512c64a92eea8f820f8085e1e806fc0970105b89
    var argument1 = [1, 2, 3, 4, 5, 6, 7]
    Solution().rotate(&argument1, 3)
    expectEqual(argument1, [5, 6, 7, 1, 2, 3, 4], "rotate-three")
    var argument2 = [-1, -100, 3, 99]
    Solution().rotate(&argument2, 2)
    expectEqual(argument2, [3, 99, -1, -100], "negative-values")
    var argument3 = [1, 2, 3]
    Solution().rotate(&argument3, 5)
    expectEqual(argument3, [2, 3, 1], "offset-larger-than-length")
    var argument4 = [1, 2]
    Solution().rotate(&argument4, 0)
    expectEqual(argument4, [1, 2], "zero-offset")
    var argument5 = [7]
    Solution().rotate(&argument5, 100)
    expectEqual(argument5, [7], "single-value")
    // EXCLUDED_VECTOR empty-array: [[],3] | The published input contains at least one value.
    // EXCLUDED_VECTOR negative-offset: [[1,2,3],-1] | The rotation count must be nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
